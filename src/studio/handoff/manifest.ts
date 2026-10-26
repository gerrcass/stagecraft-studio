import type { PilotIR } from "../ir.js";

export type HandoffAsset = {
  path: string;
  role: "video" | "audio" | "caption" | "still" | "music" | "sfx";
  hash?: string;
  bytes?: number;
};

export type HandoffManifest = {
  schemaVersion: 1;
  generator: "stagecraft-studio";
  title: string;
  duration: number;
  fps: number;
  size: { width: number; height: number };
  scenes: Array<{ id: string; start: number; duration: number; label: string }>;
  assets: HandoffAsset[];
  loudness?: { integratedLufs: number; truePeakDbtp: number };
  source: { title: string; author: string; url: string; date: string };
  model: string;
  engine: string;
  notes: string;
};

export type HandoffInput = {
  pilot: PilotIR;
  assets: HandoffAsset[];
  loudness?: { integratedLufs: number; truePeakDbtp: number };
  source: { title: string; author: string; url: string; date: string };
  model: string;
  engine: string;
};

export const buildHandoffManifest = (input: HandoffInput): HandoffManifest => ({
  schemaVersion: 1,
  generator: "stagecraft-studio",
  title: input.pilot.title,
  duration: input.pilot.duration ?? input.pilot.scenes.reduce((max, s) => Math.max(max, s.start + s.duration), 0),
  fps: input.pilot.fps,
  size: input.pilot.size,
  scenes: input.pilot.scenes.map((scene) => ({
    id: scene.id,
    start: scene.start,
    duration: scene.duration,
    label: scene.headline,
  })),
  assets: input.assets,
  loudness: input.loudness,
  source: input.source,
  model: input.model,
  engine: input.engine,
  notes:
    "Real claims trace to the source. The pilot voice is a Kokoro scratch take; replace it with the creator’s recording before publishing. The music bed is a generated scratch bed, not a licensed track.",
});
