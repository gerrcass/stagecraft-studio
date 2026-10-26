import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildFcpxml } from "../src/studio/handoff/fcpxml.js";
import { buildHandoffManifest, type HandoffAsset } from "../src/studio/handoff/manifest.js";
import { buildMarkersCsv } from "../src/studio/handoff/markers.js";
import { theoHarnessPilot } from "../src/studio/pilot/theo-harness/pilot.js";

const root = resolve(import.meta.dirname, "..");
const demo = join(root, "public", "demo");
const handoff = join(root, "handoff");

const hash = (path: string): string =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const copy = (from: string, to: string): HandoffAsset => {
  if (!existsSync(from)) {
    throw new Error(`Missing handoff input: ${from}`);
  }
  mkdirSync(resolve(to, ".."), { recursive: true });
  copyFileSync(from, to);
  const relative = to.replace(`${root}/`, "");
  const role: HandoffAsset["role"] = relative.includes("master/")
    ? "video"
    : relative.includes("audio/voice")
      ? "audio"
      : relative.includes("audio/music")
        ? "music"
        : relative.includes("captions/")
          ? "caption"
          : "still";
  return { path: relative, role, hash: hash(to) };
};

rmSync(handoff, { recursive: true, force: true });
mkdirSync(join(handoff, "plates"), { recursive: true });
mkdirSync(join(handoff, "audio", "voice"), { recursive: true });
mkdirSync(join(handoff, "audio", "music"), { recursive: true });
mkdirSync(join(handoff, "audio", "sfx"), { recursive: true });
mkdirSync(join(handoff, "captions"), { recursive: true });
mkdirSync(join(handoff, "master"), { recursive: true });

const assets: HandoffAsset[] = [];
assets.push(copy(join(demo, "theo-harness.mp4"), join(handoff, "master", "theo-harness.mp4")));
assets.push(copy(join(demo, "audio", "voice.mp3"), join(handoff, "audio", "voice.mp3")));
assets.push(copy(join(demo, "audio", "music.mp3"), join(handoff, "audio", "music", "bed.mp3")));
assets.push(copy(join(demo, "theo-harness.srt"), join(handoff, "captions", "theo-harness.srt")));
assets.push(copy(join(demo, "theo-harness.vtt"), join(handoff, "captions", "theo-harness.vtt")));

for (const file of readdirSync(join(demo, "stills")).sort()) {
  if (!file.endsWith(".png")) continue;
  assets.push(copy(join(demo, "stills", file), join(handoff, "plates", file)));
}

const voiceDir = join(root, "tmp", "voice");
if (existsSync(voiceDir)) {
  for (const file of readdirSync(voiceDir).sort()) {
    if (!file.endsWith(".wav")) continue;
    assets.push(copy(join(voiceDir, file), join(handoff, "audio", "voice", file)));
  }
}

const loudness = JSON.parse(readFileSync(join(demo, "manifest.json"), "utf8")).loudness as
  | { integratedLufs: number; truePeakDbtp: number }
  | undefined;

const manifest = buildHandoffManifest({
  pilot: theoHarnessPilot,
  assets,
  loudness,
  source: {
    title: "What is a harness?",
    author: "Theo t3.gg",
    url: "https://x.com/theo/status/2113424203345265053",
    date: "2026-10-23",
  },
  model: "opencode-go/deepseek-v4.1-flash#max",
  engine: "Stagecraft",
});

writeFileSync(join(handoff, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(join(handoff, "markers.csv"), buildMarkersCsv(theoHarnessPilot.scenes));
writeFileSync(
  join(handoff, "edit.fcpxml"),
  buildFcpxml({
    title: theoHarnessPilot.title,
    duration: theoHarnessPilot.duration ?? 90,
    fps: theoHarnessPilot.fps,
    formatWidth: theoHarnessPilot.size.width,
    formatHeight: theoHarnessPilot.size.height,
    assetPath: "master/theo-harness.mp4",
    scenes: theoHarnessPilot.scenes,
  }),
);
writeFileSync(
  join(handoff, "NOTE.md"),
  `# Handoff note

The master is \`master/theo-harness.mp4\`. The voice is a Kokoro scratch take; replace it with the
creator’s recording before publishing. The music bed is a generated scratch drone, not a licensed
track. Claims C1–C6 trace to Theo t3.gg’s article; the numbers are quoted, not re-derived.

Loudness: ${loudness ? `${loudness.integratedLufs} LUFS / ${loudness.truePeakDbtp} dBTP` : "not measured"}.

Open the project in Resolve Studio for a finishing pass; free Resolve can import the FCPXML and SRT
manually. Do not rebuild the scenes in Resolve — re-render them from the scene IR.
`,
);

console.log(`handoff → ${handoff}`);
