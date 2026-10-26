import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { theoHarnessTimings } from "../src/studio/pilot/theo-harness/pilot.js";

const root = resolve(import.meta.dirname, "..");
const stagecraftRoot = resolve(root, process.env.STAGECRAFT_ROOT ?? "../../../video");
const stagecraftCli = process.env.STAGECRAFT_CLI ?? join(stagecraftRoot, "dist", "cli.js");
const composition = join(root, "src", "pilot", "theo-harness", "composition.ts");
const tmp = join(root, "tmp");
const renderDir = join(tmp, "render");
const stillDir = join(tmp, "scene-stills");
const demo = join(root, "public", "demo");

if (!existsSync(stagecraftCli)) {
  throw new Error(
    [
      `Stagecraft CLI not found at ${stagecraftCli}.`,
      "This public repo does not include the private Stagecraft engine.",
      "Set STAGECRAFT_ROOT to a Stagecraft checkout, or STAGECRAFT_CLI to its dist/cli.js.",
      "The checked-in demo under public/demo/ is already rendered.",
    ].join("\n"),
  );
}

rmSync(stillDir, { recursive: true, force: true });
rmSync(join(demo, "stills"), { recursive: true, force: true });
mkdirSync(renderDir, { recursive: true });
mkdirSync(stillDir, { recursive: true });
mkdirSync(join(demo, "stills"), { recursive: true });

const run = (args: string[]): void => {
  execFileSync("node", [stagecraftCli, ...args], { cwd: root, stdio: "inherit" });
};

const midpoints = theoHarnessTimings.scenes.map((scene) =>
  (scene.start + scene.duration / 2).toFixed(3),
);

const silent = join(renderDir, "theo-harness-silent.mp4");
run([
  "export",
  composition,
  "--format",
  "mp4",
  "--out",
  silent,
  "--crf",
  "18",
]);

run([
  "export",
  composition,
  "--format",
  "png",
  "--at",
  midpoints.join(","),
  "--out",
  stillDir,
]);

const stills = readdirSync(stillDir)
  .filter((file) => file.endsWith(".png"))
  .sort((a, b) => {
    const time = (name: string) => Number(name.replace(/^t/, "").replace(".png", ""));
    return time(a) - time(b);
  });

stills.forEach((file, index) => {
  copyFileSync(join(stillDir, file), join(demo, "stills", `${String(index + 1).padStart(2, "0")}.png`));
});
copyFileSync(join(demo, "stills", "01.png"), join(demo, "poster.png"));
copyFileSync(join(demo, "stills", "03.png"), join(demo, "poster-diagram.png"));

const voice = join(demo, "audio", "voice.mp3");
const music = join(demo, "audio", "music.mp3");
if (!existsSync(voice) || !existsSync(music)) {
  throw new Error("Missing public/demo/audio/voice.mp3 or music.mp3; run npm run tts first.");
}

execFileSync(
  "ffmpeg",
  [
    "-y",
    "-v",
    "error",
    "-i",
    silent,
    "-i",
    voice,
    "-i",
    music,
    "-filter_complex",
    "[2:a]volume=0.16,lowpass=f=900[music];[1:a]volume=1.0[voice];[voice][music]amix=inputs=2:duration=longest:normalize=0[mix];[mix]loudnorm=I=-14:TP=-1:LRA=11,volume=2.0dB,alimiter=limit=0.85:level=false[a]",
    "-map",
    "0:v",
    "-map",
    "[a]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-t",
    String(theoHarnessTimings.total),
    join(demo, "theo-harness.mp4"),
  ],
  { stdio: "inherit" },
);

console.log(`pilot → ${join(demo, "theo-harness.mp4")}`);
