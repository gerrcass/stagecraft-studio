import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { theoHarnessPilot, theoHarnessTimings } from "../src/studio/pilot/theo-harness/pilot.js";

const root = resolve(import.meta.dirname, "..");
const demo = join(root, "public", "demo");
const video = join(demo, "theo-harness.mp4");

const probeLoudness = (): { integratedLufs: number; truePeakDbtp: number } => {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", video, "-af", "loudnorm=print_format=json", "-f", "null", "-"],
    { encoding: "utf8" },
  );
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const match = output.match(/"input_i"\s*:\s*"(-?[\d.]+)"/);
  const peak = output.match(/"input_tp"\s*:\s*"(-?[\d.]+)"/);
  if (!match || !peak) throw new Error("Could not measure loudness");
  return { integratedLufs: Number(match[1]), truePeakDbtp: Number(peak[1]) };
};

const labels = [
  "COLD OPEN",
  "INTERFACES",
  "HARNESS LOOP",
  "FIVE PARTS",
  "CLAUDE CODE",
  "RECAP",
];

const stills = Array.from({ length: 6 }, (_, index) => ({
  src: `demo/stills/${String(index + 1).padStart(2, "0")}.png`,
  label: `${String(index + 1).padStart(2, "0")} / ${labels[index]}`,
  time: Number(
    ((theoHarnessTimings.scenes[index]!.start + theoHarnessTimings.scenes[index]!.duration / 2)).toFixed(3),
  ),
}));

const manifest = {
  title: "What is a harness?",
  subtitle: "A 90-second explainer adapted from Theo t3.gg’s article.",
  duration: Number(theoHarnessTimings.total.toFixed(3)),
  width: theoHarnessPilot.size.width,
  height: theoHarnessPilot.size.height,
  fps: theoHarnessPilot.fps,
  video: "demo/theo-harness.mp4",
  poster: "demo/poster.png",
  contactSheet: "demo/contact-sheet.png",
  captions: "demo/theo-harness.srt",
  vtt: "demo/theo-harness.vtt",
  audio: "demo/audio/voice.mp3",
  loudness: probeLoudness(),
  stills,
  scenes: theoHarnessPilot.scenes.map((scene) => ({
    id: scene.id,
    label: scene.headline,
    start: Number(scene.start.toFixed(3)),
    duration: Number(scene.duration.toFixed(3)),
  })),
  source: {
    title: "What is a “harness”?",
    author: "Theo t3.gg",
    url: "https://x.com/theo/status/2113424203345265053",
    date: "2026-10-23",
  },
  model: "opencode-go/deepseek-v4.1-flash#max",
  engine: "Stagecraft",
  license: "MIT",
};

writeFileSync(join(demo, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`manifest → ${join(demo, "manifest.json")}`);
