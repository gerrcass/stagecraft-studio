import type { SceneIR } from "../ir.js";
import { enter, group, line, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";

export const sceneNumber = (scene: SceneIR, index: number): string =>
  `${String(index + 1).padStart(2, "0")} / 06`;

export const eyebrow = (
  scene: SceneIR,
  style: StylePack,
  options: { x?: number; y?: number; label?: string } = {},
): GroupLayer => {
  const reveal = enter(0.1, style.motion.enter);
  return group({
    id: `${scene.id}-eyebrow`,
    x: options.x ?? style.grid.margin,
    y: options.y ?? 96,
    opacity: reveal,
    children: [
      rect({
        width: 14,
        height: 14,
        fill: style.colors.accent,
        y: 5,
      }),
      text({
        x: 30,
        y: 0,
        text: options.label ?? scene.eyebrow ?? "STAGECRAFT STUDIO",
        font: style.fonts.mono,
        size: style.type.label,
        color: style.colors.muted,
        letterSpacing: 5,
      }),
    ],
  });
};

export const footer = (
  scene: SceneIR,
  style: StylePack,
  index: number,
  options: { y?: number } = {},
): GroupLayer => {
  const y = options.y ?? style.grid.height - 120;
  return group({
    id: `${scene.id}-footer`,
    x: style.grid.margin,
    y,
    children: [
      line({
        width: style.grid.width - style.grid.margin * 2,
        height: style.stroke.hair,
        fill: style.colors.line,
        opacity: 0.55,
      }),
      text({
        y: 22,
        text: sceneNumber(scene, index),
        font: style.fonts.mono,
        size: style.type.micro,
        color: style.colors.muted,
        letterSpacing: 3,
      }),
      text({
        x: style.grid.width - style.grid.margin * 2 - 320,
        y: 22,
        width: 320,
        align: "right",
        text: scene.claimIds.length > 0 ? `CLAIMS ${scene.claimIds.join(" · ")}` : "SOURCE / THEO T3.GG",
        font: style.fonts.mono,
        size: style.type.micro,
        color: style.colors.muted,
        letterSpacing: 2,
      }),
    ],
  });
};

export const accentRule = (
  style: StylePack,
  options: { x?: number; y: number; width?: number },
): Layer =>
  rect({
    x: options.x ?? style.grid.margin,
    y: options.y,
    width: options.width ?? 96,
    height: style.stroke.bold,
    fill: style.colors.accent,
  });

export const bodyText = (
  scene: SceneIR,
  style: StylePack,
  options: { x?: number; y: number; width?: number; color?: string } = { y: 720 },
): Layer | null => {
  if (!scene.body) return null;
  return text({
    x: options.x ?? style.grid.margin,
    y: options.y,
    width: options.width ?? 760,
    text: scene.body,
    font: style.fonts.display,
    size: style.type.bodyLg,
    color: options.color ?? style.colors.muted,
    lineHeight: 1.35,
    wrap: true,
    opacity: enter(0.25, style.motion.enter),
  });
};
