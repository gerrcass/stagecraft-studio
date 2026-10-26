import type { SceneIR } from "../ir.js";
import { enter, group, line, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { accentRule, bodyText, eyebrow, footer } from "./common.js";

export const titleScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const reveal = enter(0.15, style.motion.enter);
  const numberReveal = enter(0.35, style.motion.enter);

  const children: Layer[] = [
      eyebrow(scene, style),
      text({
        x: style.grid.margin,
        y: (time) => 286 + 30 * (1 - reveal(time)),
        width: 1260,
        text: scene.headline,
        font: style.fonts.display,
        size: style.type.displayXl,
        color: style.colors.text,
        lineHeight: 1.02,
        letterSpacing: "-0.045em",
        wrap: true,
        opacity: reveal,
      }),
      accentRule(style, { y: 650, width: 140 }),
      group({
        x: style.grid.width - style.grid.margin - 180,
        y: 292,
        opacity: numberReveal,
        children: [
          text({
            width: 180,
            align: "right",
            text: String(index + 1).padStart(2, "0"),
            font: style.fonts.mono,
            size: 96,
            color: style.colors.line,
            letterSpacing: "-0.04em",
          }),
          line({
            x: 0,
            y: 120,
            width: 180,
            height: style.stroke.hair,
            fill: style.colors.line,
            opacity: 0.7,
          }),
          text({
            x: -160,
            y: 136,
            width: 340,
            align: "right",
            text: "TERMINAL / EDITORIAL",
            font: style.fonts.mono,
            size: style.type.micro,
            color: style.colors.muted,
            letterSpacing: 2.5,
          }),
        ],
      }),
      footer(scene, style, index),
  ];

  const body = bodyText(scene, style, { y: 700, width: 780 });
  if (body) children.push(body);

  return group({
    id: scene.id,
    children,
  });
};
