import type { SceneIR } from "../ir.js";
import { enter, group, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { bodyText, eyebrow, footer } from "./common.js";

type Side = { label: string; headline: string; body?: string; accent?: boolean };

const readSide = (scene: SceneIR, key: "left" | "right", fallback: Side): Side => {
  const raw = scene.data?.[key];
  if (typeof raw !== "object" || raw === null) return fallback;
  const value = raw as Record<string, unknown>;
  return {
    label: typeof value.label === "string" ? value.label : fallback.label,
    headline: typeof value.headline === "string" ? value.headline : fallback.headline,
    body: typeof value.body === "string" ? value.body : fallback.body,
    accent: value.accent === true,
  };
};

const column = (
  side: Side,
  x: number,
  style: StylePack,
  delay: number,
): Layer[] => {
  const reveal = enter(delay, style.motion.enter);
  return [
    text({
      x,
      y: 300,
      text: side.label,
      font: style.fonts.mono,
      size: style.type.label,
      color: side.accent ? style.colors.accent : style.colors.muted,
      letterSpacing: 4,
      opacity: reveal,
    }),
    text({
      x,
      width: 620,
      text: side.headline,
      font: style.fonts.display,
      size: style.type.displayMd,
      color: side.accent ? style.colors.accent : style.colors.text,
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      wrap: true,
      opacity: reveal,
      y: (time) => 350 + 20 * (1 - reveal(time)),
    }),
    ...(side.body
      ? [
          text({
            x,
            y: 600,
            width: 600,
            text: side.body,
            font: style.fonts.display,
            size: style.type.body,
            color: style.colors.muted,
            lineHeight: 1.45,
            wrap: true,
            opacity: enter(delay + 0.16, style.motion.enter),
          }),
        ]
      : []),
  ];
};

export const compareScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const left = readSide(scene, "left", {
    label: "INTERFACE",
    headline: "Humans see the app.",
    body: "A terminal, a website, a chat window. The code underneath stays hidden.",
  });
  const right = readSide(scene, "right", {
    label: "HARNESS",
    headline: "LLMs see the loop.",
    body: "Tools, a calling syntax, a parser and a result channel. The model only sends text.",
    accent: true,
  });

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
    rect({
      x: 940,
      y: 330,
      width: style.stroke.hair,
      height: 420,
      fill: style.colors.line,
      opacity: 0.7,
    }),
    ...column(left, style.grid.margin, style, 0.2),
    ...column(right, 1040, style, 0.32),
    footer(scene, style, index),
  ];

  const body = bodyText(scene, style, { y: 830, width: 1300 });
  if (body) children.push(body);

  return group({ id: scene.id, children });
};
