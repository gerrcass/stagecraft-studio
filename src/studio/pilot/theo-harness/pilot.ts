import { parsePilot } from "../../ir.js";
import { sceneSeeds } from "./script.js";
import timings from "./timings.json";

const byId = new Map(timings.scenes.map((scene) => [scene.id, scene]));

export const theoHarnessPilot = parsePilot({
  id: "theo-harness",
  title: "What is a harness?",
  description:
    "A 90-second explainer adapted from Theo t3.gg’s article about interfaces, harnesses and agents.",
  size: { width: 1920, height: 1080 },
  fps: 30,
  duration: timings.total,
  stylePack: "terminal-editorial",
  scenes: sceneSeeds.map((seed) => {
    const timing = byId.get(seed.id);
    if (!timing) {
      throw new Error(`No voice timing for ${seed.id}; run npm run tts`);
    }
    const { hold: _hold, ...scene } = seed;
    return {
      ...scene,
      start: timing.start,
      duration: timing.duration,
    };
  }),
});

export const theoHarnessTimings = timings;
