import { describe, expect, it } from "vitest";
import { parsePilot, validatePilot } from "../src/studio/ir.js";

const scene = (id: string, start: number, duration: number) => ({
  id,
  archetype: "statement" as const,
  start,
  duration,
  narration: "A line of narration.",
  headline: "A headline",
  claimIds: ["C1"],
  transition: "fade" as const,
});

const pilot = {
  id: "test-pilot",
  title: "Test pilot",
  size: { width: 1920, height: 1080 },
  fps: 30,
  duration: 10,
  stylePack: "terminal-editorial",
  scenes: [scene("one", 0, 5), scene("two", 5, 5)],
};

describe("scene IR", () => {
  it("accepts a valid pilot and fills defaults", () => {
    const parsed = parsePilot({
      ...pilot,
      scenes: [{ ...scene("one", 0, 5), transition: undefined }, scene("two", 5, 5)],
    });

    expect(parsed.scenes[0]?.transition).toBe("fade");
    expect(parsed.scenes[0]?.claimIds).toEqual(["C1"]);
  });

  it("rejects duplicate scene ids", () => {
    const result = validatePilot({
      ...pilot,
      scenes: [scene("same", 0, 4), scene("same", 4, 6)],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("duplicate"))).toBe(true);
    }
  });

  it("rejects overlapping scenes", () => {
    const result = validatePilot({
      ...pilot,
      scenes: [scene("one", 0, 6), scene("two", 5, 5)],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("before the previous"))).toBe(true);
    }
  });

  it("rejects a duration that does not match the last scene", () => {
    const result = validatePilot({
      ...pilot,
      duration: 20,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.path === "duration")).toBe(true);
    }
  });

  it("rejects an unknown archetype", () => {
    const result = validatePilot({
      ...pilot,
      scenes: [{ ...scene("one", 0, 10), archetype: "slideshow" }],
    });

    expect(result.ok).toBe(false);
  });
});
