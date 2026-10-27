export type CaptionScene = {
  id: string;
  narration: string;
  start: number;
  voiceDuration: number;
};

export type Cue = {
  start: number;
  end: number;
  text: string;
};

export const splitSentences = (text: string): string[] => {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return parts.map((part) => part.trim()).filter(Boolean);
};

export const formatSrtTime = (seconds: number): string => {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const hh = Math.floor(totalMs / 3_600_000);
  const mm = Math.floor((totalMs % 3_600_000) / 60_000);
  const ss = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
};

export const formatVttTime = (seconds: number): string => formatSrtTime(seconds).replace(",", ".");

/** Allocate sentence-level cues from the measured voice duration, weighted by words. */
export const buildSceneCues = (scene: CaptionScene): Cue[] => {
  const sentences = splitSentences(scene.narration);
  const totalWords = sentences.reduce(
    (total, sentence) => total + sentence.split(/\s+/).filter(Boolean).length,
    0,
  );
  const cues: Cue[] = [];
  let cursor = scene.start;
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).filter(Boolean).length;
    const length = Math.max(1.4, (words / Math.max(1, totalWords)) * scene.voiceDuration);
    const end = Math.min(scene.start + scene.voiceDuration, cursor + length);
    cues.push({ start: cursor, end, text: sentence });
    cursor = end;
  }
  return cues;
};

export const buildCues = (scenes: CaptionScene[]): Cue[] =>
  scenes.flatMap((scene) => buildSceneCues(scene));

export const buildSrt = (cues: Cue[]): string =>
  `${cues
    .map(
      (cue, index) =>
        `${index + 1}\n${formatSrtTime(cue.start)} --> ${formatSrtTime(cue.end)}\n${cue.text}\n`,
    )
    .join("\n")}\n`;

export const buildVtt = (cues: Cue[]): string =>
  `WEBVTT\n\n${cues
    .map((cue) => `${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}\n${cue.text}\n`)
    .join("\n")}`;

export type CueIssue = { index: number; message: string };

export const validateCues = (cues: Cue[], total: number): CueIssue[] => {
  const issues: CueIssue[] = [];
  let previousEnd = 0;
  cues.forEach((cue, index) => {
    if (!Number.isFinite(cue.start) || !Number.isFinite(cue.end)) {
      issues.push({ index, message: "cue has an invalid timestamp" });
      return;
    }
    if (cue.start < previousEnd - 0.001) {
      issues.push({ index, message: `cue starts at ${cue.start}s before the previous cue ends` });
    }
    if (cue.end <= cue.start) {
      issues.push({ index, message: `cue ends at ${cue.end}s before it starts` });
    }
    if (cue.end > total + 0.1) {
      issues.push({ index, message: `cue ends at ${cue.end}s after the film ends at ${total}s` });
    }
    previousEnd = Math.max(previousEnd, cue.end);
  });
  return issues;
};

export const parseSrt = (input: string): Cue[] => {
  const blocks = input.trim().split(/\n\s*\n/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const timeLine = lines.find((line) => line.includes("-->"));
    if (!timeLine) continue;
    const [startText, endText] = timeLine.split("-->").map((value) => value.trim());
    if (!startText || !endText) continue;
    const parse = (value: string): number => {
      const match = value.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
      if (!match) return Number.NaN;
      return (
        Number(match[1]) * 3600 +
        Number(match[2]) * 60 +
        Number(match[3]) +
        Number(match[4]) / 1000
      );
    };
    const text = lines
      .filter((line) => line !== timeLine && !/^\d+$/.test(line.trim()))
      .join(" ")
      .trim();
    if (text) cues.push({ start: parse(startText), end: parse(endText), text });
  }
  return cues;
};
