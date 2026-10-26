import type { SceneIR } from "../ir.js";
import { enter, group, rect, text, type GroupLayer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { accentRule, bodyText, eyebrow, footer } from "./common.js";

export const statementScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const reveal = enter(0.12, style.motion.enter);
  const ruleReveal = enter(0.4, style.motion.hero);
  const accent = typeof scene.data?.accent === "string" ? scene.data.accent : undefined;

  return group({
    id: scene.id,
    children: [
      eyebrow(scene, style),
      text({
        x: style.grid.margin,
        y: (time) => 330 + 24 * (1 - reveal(time)),
        width: style.grid.width - style.grid.margin * 2 - 120,
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
      bodyText(scene, style, { y: 740, width: 860 }),
      accent
        ? text({
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
          })
        : null,
      footer(scene, style, index),
    ].filter((layer): layer is NonNullable<typeof layer> => layer !== null),
  });
};
