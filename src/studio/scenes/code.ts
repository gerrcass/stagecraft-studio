import type { SceneIR } from "../ir.js";
import { enter, group, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { bodyText, eyebrow, footer } from "./common.js";

const defaultLines = [
  "<read_file name=\"README.md\">",
  "",
  "  tool_call: read_file",
  "  path: README.md",
  "",
  "</read_file>",
];

const readLines = (scene: SceneIR): string[] => {
  const raw = scene.data?.code;
  if (!Array.isArray(raw)) return defaultLines;
  return raw.filter((line): line is string => typeof line === "string");
};

export const codeScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const lines = readLines(scene);
  const reveal = enter(0.2, style.motion.enter);
  const lineHeight = 40;

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
      x: style.grid.margin,
      y: 330,
      width: 1200,
      height: 430,
      fill: style.colors.panel,
      stroke: style.colors.line,
      strokeWidth: style.stroke.hair,
      radius: style.radii.small,
      opacity: reveal,
    }),
    rect({
      x: style.grid.margin,
      y: 330,
      width: 6,
      height: 430,
      fill: style.colors.accent,
      opacity: reveal,
    }),
    ...lines.map((line, lineIndex) =>
      text({
        x: style.grid.margin + 46,
        y: 360 + lineIndex * lineHeight,
        width: 1100,
        text: line,
        font: style.fonts.mono,
        size: style.type.code,
        color: line.trim().startsWith("<") ? style.colors.accent : style.colors.text,
        opacity: enter(0.35 + lineIndex * 0.05, 0.3),
      }),
    ),
  ];

  const body = bodyText(scene, style, { y: 800, width: 1100 });
  if (body) children.push(body);
  children.push(footer(scene, style, index));

  return group({ id: scene.id, children });
};
