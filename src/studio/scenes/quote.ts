import type { SceneIR } from "../ir.js";
import { enter, group, text, type GroupLayer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { eyebrow, footer } from "./common.js";

export const quoteScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const reveal = enter(0.15, style.motion.enter);
  const attribution = typeof scene.data?.attribution === "string" ? scene.data.attribution : scene.body;

  return group({
    id: scene.id,
    children: [
      eyebrow(scene, style),
      text({
        x: style.grid.margin,
        y: 270,
        text: "“",
        font: style.fonts.display,
        size: style.type.quote,
        color: style.colors.accent,
        lineHeight: 1,
        opacity: reveal,
      }),
      text({
        x: style.grid.margin + 70,
        width: 1500,
        text: scene.headline,
        font: style.fonts.display,
        size: style.type.displayLg,
        color: style.colors.text,
        lineHeight: 1.04,
        letterSpacing: "-0.045em",
        wrap: true,
        opacity: reveal,
        y: (time) => 300 + 24 * (1 - reveal(time)),
      }),
      attribution
        ? text({
            x: style.grid.margin + 70,
            y: 760,
            width: 900,
            text: attribution,
            font: style.fonts.mono,
            size: style.type.label,
            color: style.colors.muted,
            letterSpacing: 3,
            opacity: enter(0.4, style.motion.enter),
          })
        : null,
      footer(scene, style, index),
    ].filter((layer): layer is NonNullable<typeof layer> => layer !== null),
  });
};
