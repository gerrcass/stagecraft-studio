import type { SceneIR } from "../ir.js";
import { enter, group, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { bodyText, eyebrow, footer } from "./common.js";

type Step = { label: string; body?: string };

const defaultSteps: Step[] = [
  { label: "TOOLS", body: "read_file, edit_file, bash, search" },
  { label: "SYNTAX", body: "A text format the model can emit" },
  { label: "PARSER", body: "Reads the message and runs the code" },
  { label: "RESULT", body: "The output goes back into the model" },
  { label: "TOOL LIST", body: "What the model is allowed to call" },
];

const readSteps = (scene: SceneIR): Step[] => {
  const raw = scene.data?.steps;
  if (!Array.isArray(raw)) return defaultSteps;
  const steps = raw.filter((item): item is Step => {
    if (typeof item !== "object" || item === null) return false;
    const value = item as Record<string, unknown>;
    return typeof value.label === "string";
  });
  return steps.length > 0 ? steps : defaultSteps;
};

export const stepsScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const steps = readSteps(scene);
  const startY = 300;
  const rowHeight = 112;
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
  ];

  steps.forEach((step, stepIndex) => {
    const reveal = enter(0.3 + stepIndex * 0.11, 0.4);
    const y = startY + stepIndex * rowHeight;
    children.push(
      rect({
        x: style.grid.margin,
        y,
        width: (time) => (style.grid.width - style.grid.margin * 2) * reveal(time),
        height: style.stroke.hair,
        fill: stepIndex === steps.length - 1 ? style.colors.accent : style.colors.line,
        opacity: 0.85,
      }),
      text({
        x: style.grid.margin,
        y: y + 22,
        text: String(stepIndex + 1).padStart(2, "0"),
        font: style.fonts.mono,
        size: 14,
        color: style.colors.accent,
        letterSpacing: 2,
        opacity: reveal,
      }),
      text({
        x: style.grid.margin + 90,
        y: y + 16,
        width: 360,
        text: step.label,
        font: style.fonts.display,
        size: style.type.displaySm,
        color: style.colors.text,
        letterSpacing: "-0.02em",
        opacity: reveal,
      }),
      text({
        x: style.grid.margin + 480,
        y: y + 28,
        width: 900,
        text: step.body ?? "",
        font: style.fonts.display,
        size: style.type.body,
        color: style.colors.muted,
        opacity: reveal,
      }),
    );
  });

  const body = bodyText(scene, style, { y: 870, width: 1200 });
  if (body) children.push(body);
  children.push(footer(scene, style, index));

  return group({ id: scene.id, children });
};
