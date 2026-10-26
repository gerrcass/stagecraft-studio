import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const get = (flag: string, fallback: string): string => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1]! : fallback;
};

const dir = resolve(root, get("--dir", "qa/stills"));
const out = resolve(root, get("--out", "qa/contact-sheet.png"));
const cols = Number(get("--cols", "3"));

if (!existsSync(dir)) {
  throw new Error(`No stills directory at ${dir}`);
}

const files = readdirSync(dir)
  .filter((file) => file.endsWith(".png"))
  .sort();
if (files.length === 0) {
  throw new Error(`No PNGs in ${dir}`);
}

const rows = Math.ceil(files.length / cols);
mkdirSync(dirname(out), { recursive: true });

execFileSync(
  "ffmpeg",
  [
    "-y",
    "-v",
    "error",
    "-pattern_type",
    "glob",
    "-i",
    join(dir, "*.png"),
    "-vf",
    `scale=640:360,tile=${cols}x${rows}`,
    "-frames:v",
    "1",
    out,
  ],
  { stdio: "inherit" },
);

console.log(`contact sheet → ${out}`);
