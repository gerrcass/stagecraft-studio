import type { SceneIR } from "../ir.js";
import { enter, group, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { accentRule, bodyText, eyebrow, footer } from "./common.js";

const readChips = (scene: SceneIR): string[] => {
  const raw = scene.data?.chips;
  return Array.isArray(raw)
    ? raw.filter((chip): chip is string => typeof chip === "string")
    : [];
};

export const statementScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const reveal = enter(0.12, style.motion.enter);
  const ruleReveal = enter(0.4, style.motion.hero);
  const accent = typeof scene.data?.accent === "string" ? scene.data.accent : undefined;
  const chips = readChips(scene);
  const hasChips = chips.length > 0;

  const children: Layer[] = [
    eyebrow(scene, style),
    text({
      x: style.grid.margin,
      y: (time) => 330 + 24 * (1 - reveal(time)),
      width: hasChips ? 1080 : style.grid.width - style.grid.margin * 2 - 120,
      text: scene.headline,
      font: style.fonts.display,
      size: style.type.displayLg,
      color: style.colors.text,
      lineHeight: 1.05,
      letterSpacing: "-0.04em",
      wrap: true,
      opacity: reveal,
    }),
    rect({
      x: style.grid.margin,
      y: 690,
      width: (time) => 180 * ruleReveal(time),
      height: style.stroke.bold,
      fill: style.colors.accent,
    }),
  ];

  const body = bodyText(scene, style, { y: 740, width: 860 });
  if (body) children.push(body);

  if (accent) {
    children.push(
      text({
        x: style.grid.width - style.grid.margin - 360,
        y: 748,
        width: 360,
        align: "right",
        text: accent,
        font: style.fonts.mono,
        size: style.type.label,
        color: style.colors.accent,
        letterSpacing: 2,
        opacity: enter(0.55, style.motion.enter),
      }),
    );
  }

  if (hasChips) {
    chips.forEach((chip, chipIndex) => {
      const chipReveal = enter(0.35 + chipIndex * 0.12, 0.4);
      const y = 330 + chipIndex * 106;
      children.push(
        group({
          x: 1440,
          y,
          opacity: chipReveal,
          children: [
            rect({
              width: 320,
              height: 78,
              fill: style.colors.panel,
              stroke: style.colors.line,
              strokeWidth: style.stroke.hair,
              radius: style.radii.small,
            }),
            text({
              x: 22,
              y: 24,
              width: 280,
              text: chip,
              font: style.fonts.mono,
              size: style.type.label,
              color: style.colors.text,
              letterSpacing: 4,
            }),
            rect({
              x: 286,
              y: 30,
              width: 14,
              height: 14,
              fill: chipIndex === 0 ? style.colors.accent : style.colors.line,
            }),
          ],
        }),
      );
    });
  }

  children.push(footer(scene, style, index));

  return group({ id: scene.id, children });
};
