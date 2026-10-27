import { describe, expect, it } from "vitest";
import { buildFcpxml } from "../src/studio/handoff/fcpxml.js";
import { buildHandoffManifest } from "../src/studio/handoff/manifest.js";
import { buildMarkersCsv } from "../src/studio/handoff/markers.js";
import { theoHarnessPilot } from "../src/studio/pilot/theo-harness/pilot.js";

describe("handoff", () => {
  it("builds a manifest with scenes, assets and source", () => {
    const manifest = buildHandoffManifest({
      pilot: theoHarnessPilot,
      assets: [{ path: "master/theo-harness.mp4", role: "video" }],
      loudness: { integratedLufs: -14.5, truePeakDbtp: -1.3 },
      source: {
        title: "What is a harness?",
        author: "Theo t3.gg",
        url: "https://x.com/theo/status/2113424203345265053",
        date: "2026-10-23",
      },
      model: "opencode-go/deepseek-v4.1-flash#max",
      engine: "Stagecraft",
    });

    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.scenes).toHaveLength(6);
    expect(manifest.assets[0]?.role).toBe("video");
    expect(manifest.loudness?.integratedLufs).toBe(-14.5);
  });

  it("builds a valid-looking FCPXML with a master clip and markers", () => {
    const xml = buildFcpxml({
      title: theoHarnessPilot.title,
      duration: theoHarnessPilot.duration ?? 90,
      fps: theoHarnessPilot.fps,
      formatWidth: 1920,
      formatHeight: 1080,
      assetPath: "master/theo-harness.mp4",
      scenes: theoHarnessPilot.scenes,
    });

    expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
    expect(xml).toContain('<fcpxml version="1.9">');
    expect(xml).toContain("theo-harness.mp4");
    expect(xml).toContain("<marker");
    expect((xml.match(/<marker/g) ?? []).length).toBe(6);
  });

  it("builds a markers CSV with one row per scene", () => {
    const csv = buildMarkersCsv(theoHarnessPilot.scenes);
    expect(csv.split("\n")).toHaveLength(8);
    expect(csv).toContain("01-cold-open");
  });
});
