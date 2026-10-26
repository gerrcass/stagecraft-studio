import type { SceneIR } from "../ir.js";
import { enter, group, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { bodyText, eyebrow, footer } from "./common.js";

const box = (
  label: string,
  detail: string,
  x: number,
  style: StylePack,
  accent: boolean,
  delay: number,
): Layer[] => {
  const reveal = enter(delay, 0.45);
  return [
    rect({
      x,
      y: 430,
      width: 360,
      height: 170,
      fill: accent ? style.colors.panel : "none",
      stroke: accent ? style.colors.accent : style.colors.line,
      strokeWidth: accent ? style.stroke.line : style.stroke.hair,
      radius: style.radii.small,
      opacity: reveal,
    }),
    text({
      x,
      y: 470,
      width: 360,
      align: "center",
      text: label,
      font: style.fonts.display,
      size: 64,
      color: accent ? style.colors.accent : style.colors.text,
      letterSpacing: "-0.04em",
      opacity: reveal,
    }),
    text({
      x,
      y: 550,
      width: 360,
      align: "center",
      text: detail,
      font: style.fonts.mono,
      size: 12,
      color: style.colors.muted,
      letterSpacing: 3,
      opacity: reveal,
    }),
  ];
};

export const recapScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const children: Layer[] = [
    eyebrow(scene, style),
    text({
      x: style.grid.margin,
      y: 190,
      width: 1500,
      text: scene.headline,
      font: style.fonts.display,
      size: style.type.displayMd,
      color: style.colors.text,
      lineHeight: 1.05,
      letterSpacing: "-0.04em",
      wrap: true,
      opacity: enter(0.1, style.motion.enter),
    }),
    ...box("LLM", "THE CHEF", 120, style, false, 0.3),
    ...box("HARNESS", "THE KITCHEN", 760, style, true, 0.45),
    ...box("AGENT", "THE DISH", 1400, style, false, 0.6),
    text({
      x: 540,
      y: 505,
      width: 120,
      align: "center",
      text: "+",
      font: style.fonts.display,
      size: 56,
      color: style.colors.muted,
      opacity: enter(0.38, 0.3),
    }),
    text({
      x: 1180,
      y: 505,
      width: 120,
      align: "center",
      text: "=",
      font: style.fonts.display,
      size: 56,
      color: style.colors.muted,
      opacity: enter(0.55, 0.3),
    }),
  ];

  const body = bodyText(scene, style, { y: 700, width: 1300, color: style.colors.text });
  if (body) children.push(body);
  children.push(footer(scene, style, index));

  return group({ id: scene.id, children });
};
