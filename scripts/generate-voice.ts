import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { sceneSeeds } from "../src/studio/pilot/theo-harness/script.js";

const root = resolve(import.meta.dirname, "..");
const voiceDir = join(root, "tmp", "voice");
const publicAudio = join(root, "public", "demo", "audio");
const timingsFile = join(root, "src", "studio", "pilot", "theo-harness", "timings.json");
const voice = process.env.PILOT_VOICE ?? "am_michael";
const speed = Number(process.env.PILOT_SPEED ?? "1");
const python = process.env.HYPERFRAMES_PYTHON ?? join(root, ".venv", "bin", "python");

mkdirSync(voiceDir, { recursive: true });
mkdirSync(publicAudio, { recursive: true });

const run = (command: string, args: string[], env = process.env): string => {
  const result = spawnSync(command, args, {
    cwd: root,
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed\n${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    );
  }
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
};

const probeDuration = (file: string): number => {
  const output = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1", file],
    { encoding: "utf8" },
  );
  const value = Number(output.trim().split("=")[1]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Could not measure ${file}`);
  }
  return value;
};

const formatSrtTime = (seconds: number): string => {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const hh = Math.floor(totalMs / 3_600_000);
  const mm = Math.floor((totalMs % 3_600_000) / 60_000);
  const ss = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
};

const formatVttTime = (seconds: number): string => formatSrtTime(seconds).replace(",", ".");

const sentences = (text: string): string[] => {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return parts.map((part) => part.trim()).filter(Boolean);
};

type Cue = { start: number; end: number; text: string };
const cues: Cue[] = [];

let start = 0;
const sceneTimings: Array<{
  id: string;
  voiceDuration: number;
  hold: number;
  start: number;
  duration: number;
}> = [];

for (const scene of sceneSeeds) {
  const wav = join(voiceDir, `${scene.id}.wav`);
  const textFile = join(voiceDir, `${scene.id}.txt`);
  writeFileSync(textFile, scene.narration, "utf8");
  console.log(`voice ${scene.id}…`);
  run("npx", [
    "--yes",
    "hyperframes@0.8.206",
    "tts",
    scene.narration,
    "--voice",
    voice,
    "--speed",
    String(speed),
    "--output",
    wav,
  ], { ...process.env, HYPERFRAMES_PYTHON: python });
  const voiceDuration = probeDuration(wav);
  const duration = voiceDuration + scene.hold;
  sceneTimings.push({ id: scene.id, voiceDuration, hold: scene.hold, start, duration });

  const sceneSentences = sentences(scene.narration);
  const totalWords = sceneSentences.reduce(
    (total, sentence) => total + sentence.split(/\s+/).filter(Boolean).length,
    0,
  );
  let cursor = start;
  for (const sentence of sceneSentences) {
    const words = sentence.split(/\s+/).filter(Boolean).length;
    const length = Math.max(1.4, (words / Math.max(1, totalWords)) * voiceDuration);
    const end = Math.min(start + voiceDuration, cursor + length);
    cues.push({ start: cursor, end, text: sentence });
    cursor = end;
  }

  start += duration;
}

const total = start;
writeFileSync(
  timingsFile,
  `${JSON.stringify({ voice, speed, total, scenes: sceneTimings }, null, 2)}\n`,
  "utf8",
);

const srt = cues
  .map((cue, index) => {
    const body = `${index + 1}\n${formatSrtTime(cue.start)} --> ${formatSrtTime(cue.end)}\n${cue.text}\n`;
    return body;
  })
  .join("\n");
writeFileSync(join(root, "public", "demo", "theo-harness.srt"), srt, "utf8");

const vtt = `WEBVTT\n\n${cues
  .map((cue) => `${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}\n${cue.text}\n`)
  .join("\n")}`;
writeFileSync(join(root, "public", "demo", "theo-harness.vtt"), vtt, "utf8");

const inputs = sceneSeeds.flatMap((scene) => ["-i", join(voiceDir, `${scene.id}.wav`)]);
const filters = sceneTimings.map(
  (scene, index) =>
    `[${index}:a]adelay=${Math.round(scene.start * 1000)}|${Math.round(scene.start * 1000)}[a${index}]`,
);
const mixInputs = sceneTimings.map((_, index) => `[a${index}]`).join("");
const filter = `${filters.join(";")};${mixInputs}amix=inputs=${sceneTimings.length}:normalize=0[out]`;
const voiceMp3 = join(publicAudio, "voice.mp3");

run("ffmpeg", [
  "-y",
  ...inputs,
  "-filter_complex",
  `${filter};[out]apad=whole_dur=${total}[padded]`,
  "-map",
  "[padded]",
  "-t",
  String(total),
  "-ac",
  "1",
  "-ar",
  "48000",
  "-c:a",
  "libmp3lame",
  "-b:a",
  "160k",
  voiceMp3,
]);

const manifest = {
  voice,
  speed,
  total,
  scenes: sceneTimings,
  audio: "audio/voice.mp3",
  srt: "theo-harness.srt",
  vtt: "theo-harness.vtt",
};
writeFileSync(join(publicAudio, "voice.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const measured = JSON.parse(readFileSync(timingsFile, "utf8")) as typeof manifest;
console.log(`voice track ${measured.total.toFixed(2)}s → ${voiceMp3}`);
