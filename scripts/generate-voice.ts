import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  buildCues,
  buildSrt,
  buildVtt,
  type CaptionScene,
  type Cue,
} from "../src/studio/audio/captions.js";
import { sceneSeeds } from "../src/studio/pilot/theo-harness/script.js";

const root = resolve(import.meta.dirname, "..");
const voiceDir = join(root, "tmp", "voice");
const publicAudio = join(root, "public", "demo", "audio");
const publicVoice = join(publicAudio, "voice");
const timingsFile = join(root, "src", "studio", "pilot", "theo-harness", "timings.json");
const voice = process.env.PILOT_VOICE ?? "am_michael";
const speed = Number(process.env.PILOT_SPEED ?? "0.92");
const python = process.env.HYPERFRAMES_PYTHON ?? join(root, ".venv", "bin", "python");

mkdirSync(voiceDir, { recursive: true });
mkdirSync(publicAudio, { recursive: true });
mkdirSync(publicVoice, { recursive: true });

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

const captionScenes: CaptionScene[] = [];
const sceneTimings: Array<{
  id: string;
  voiceDuration: number;
  hold: number;
  start: number;
  duration: number;
}> = [];

let start = 0;
for (const scene of sceneSeeds) {
  const wav = join(voiceDir, `${scene.id}.wav`);
  const textFile = join(voiceDir, `${scene.id}.txt`);
  writeFileSync(textFile, scene.narration, "utf8");
  console.log(`voice ${scene.id}…`);
  run(
    "npx",
    [
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
    ],
    { ...process.env, HYPERFRAMES_PYTHON: python },
  );
  const voiceDuration = probeDuration(wav);
  const duration = voiceDuration + scene.hold;
  sceneTimings.push({ id: scene.id, voiceDuration, hold: scene.hold, start, duration });
  captionScenes.push({ id: scene.id, narration: scene.narration, start, voiceDuration });
  copyFileSync(wav, join(publicVoice, `${scene.id}.wav`));
  start += duration;
}

const total = start;
writeFileSync(
  timingsFile,
  `${JSON.stringify({ voice, speed, total, scenes: sceneTimings }, null, 2)}\n`,
  "utf8",
);

const cues: Cue[] = buildCues(captionScenes);
writeFileSync(join(root, "public", "demo", "theo-harness.srt"), buildSrt(cues), "utf8");
writeFileSync(join(root, "public", "demo", "theo-harness.vtt"), buildVtt(cues), "utf8");

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
