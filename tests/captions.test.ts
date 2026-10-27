import { describe, expect, it } from "vitest";
import {
  buildCues,
  buildSrt,
  buildVtt,
  formatSrtTime,
  parseSrt,
  validateCues,
} from "../src/studio/audio/captions.js";

const scenes = [
  {
    id: "a",
    narration: "One idea. Another idea. A third line.",
    start: 0,
    voiceDuration: 6,
  },
  {
    id: "b",
    narration: "The next scene starts here.",
    start: 6,
    voiceDuration: 3,
  },
];

describe("captions", () => {
  it("formats SRT timestamps", () => {
    expect(formatSrtTime(0)).toBe("00:00:00,000");
    expect(formatSrtTime(61.5)).toBe("00:01:01,500");
  });

  it("allocates monotonic cues within the voice duration", () => {
    const cues = buildCues(scenes);
    expect(cues.length).toBeGreaterThanOrEqual(4);
    expect(validateCues(cues, 9)).toEqual([]);
    expect(cues.at(-1)!.end).toBeLessThanOrEqual(9);
  });

  it("builds SRT and VTT that round-trip", () => {
    const cues = buildCues(scenes);
    const srt = buildSrt(cues);
    expect(srt).toContain("00:00:00,000 -->");
    expect(() => parseSrt(srt)).not.toThrow();
    expect(parseSrt(srt)).toHaveLength(cues.length);
    expect(buildVtt(cues).startsWith("WEBVTT")).toBe(true);
  });

  it("flags overlapping cues", () => {
    const issues = validateCues(
      [
        { start: 0, end: 2, text: "A" },
        { start: 1, end: 3, text: "B" },
      ],
      3,
    );
    expect(issues[0]?.message).toContain("before the previous");
  });

  it("flags invalid SRT timestamps instead of ignoring them", () => {
    const cues = parseSrt("1\nnot-a-time --> 00:00:02,000\nHello\n");
    expect(validateCues(cues, 3)[0]?.message).toContain("invalid timestamp");
  });
});
