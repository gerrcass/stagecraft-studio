import type { PilotIR, SceneIR } from "./ir.js";
import { pilotDuration } from "./ir.js";
import { enter, group, scene, type GroupLayer, type Layer } from "./layers.js";
import { sceneBuilders } from "./scenes/index.js";
import type { StylePack } from "./style/terminal-editorial.js";

export type CompiledComposition = {
  id: string;
  title: string;
  description?: string;
  size: { width: number; height: number };
  fps: number;
  duration: number;
  theme: {
    name: string;
    colors: Record<string, string>;
    fonts: Record<string, string>;
  };
  root: GroupLayer;
  scenes: Array<{ id: string; start: number; duration: number }>;
};

const sceneFade = (scene: SceneIR, time: number): number => {
  if (scene.transition === "cut") return 1;
  const fadeIn = enter(0, 0.18)(time);
  const fadeOut = 1 - enter(Math.max(0, scene.duration - 0.18), 0.18)(time);
  return Math.min(fadeIn, fadeOut);
};

const scenePush = (scene: SceneIR) => {
  const reveal = enter(0, 0.28);
  return (time: number) => (1 - reveal(time)) * 28;
};

export const compileScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const builder = sceneBuilders[scene.archetype];
  if (!builder) {
    throw new Error(`No builder for archetype "${scene.archetype}"`);
  }
  return builder(scene, style, index);
};

export const compilePilot = (pilot: PilotIR, style: StylePack): CompiledComposition => {
  const duration = pilotDuration(pilot);
  const scenes: Layer[] = pilot.scenes.map((sceneIR, index) => {
    const content = compileScene(sceneIR, style, index);
    const opacity = (time: number) => sceneFade(sceneIR, time);
    const y = sceneIR.transition === "push" ? scenePush(sceneIR) : 0;
    return scene({
      id: `${sceneIR.id}-scene`,
      at: sceneIR.start,
      width: pilot.size.width,
      height: pilot.size.height,
      children: [
        group({
          id: `${sceneIR.id}-fade`,
          width: pilot.size.width,
          height: pilot.size.height,
          opacity,
          y,
          children: [content],
        }),
      ],
    });
  });

  return {
    id: pilot.id,
    title: pilot.title,
    description: pilot.description,
    size: pilot.size,
    fps: pilot.fps,
    duration,
    theme: {
      name: style.id,
      colors: {
        background: style.colors.background,
        text: style.colors.text,
        muted: style.colors.muted,
        accent: style.colors.accent,
        success: style.colors.success,
        line: style.colors.line,
      },
      fonts: style.fonts,
    },
    root: group({
      id: `${pilot.id}-root`,
      width: pilot.size.width,
      height: pilot.size.height,
      children: scenes,
    }),
    scenes: pilot.scenes.map((s) => ({ id: s.id, start: s.start, duration: s.duration })),
  };
};
