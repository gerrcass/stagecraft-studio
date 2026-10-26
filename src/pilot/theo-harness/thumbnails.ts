import { defineComposition, group, path, rect, scene, text } from "stagecraft";
import { terminalEditorial as s } from "../../studio/style/terminal-editorial.js";

const box = (label: string, detail: string, x: number, accent = false) => [
  rect({
    x,
    y: 300,
    width: 300,
    height: 150,
    fill: accent ? s.colors.panel : "none",
    stroke: accent ? s.colors.accent : s.colors.line,
    strokeWidth: accent ? 2 : 1,
    radius: 4,
  }),
  text({
    x,
    y: 330,
    width: 300,
    align: "center",
    text: label,
    size: 46,
    color: accent ? s.colors.accent : s.colors.text,
    letterSpacing: "-0.03em",
  }),
  text({
    x,
    y: 392,
    width: 300,
    align: "center",
    text: detail,
    font: s.fonts.mono,
    size: 13,
    color: s.colors.muted,
    letterSpacing: 2,
  }),
];

const page = (id: "a" | "b" | "c", children: ReturnType<typeof group>["children"]) => {
  const start = id === "a" ? 0 : id === "b" ? 3 : 6;
  return scene({
    id,
    at: start,
    opacity: (time) => (time >= start && time < start + 3 ? 1 : 0),
    children: [group({ children })],
  });
};

export default defineComposition({
  id: "theo-harness-thumbnails",
  title: "Theo harness thumbnails",
  size: { width: 1280, height: 720 },
  fps: 30,
  duration: 9,
  theme: {
    colors: {
      background: s.colors.background,
      text: s.colors.text,
      muted: s.colors.muted,
      accent: s.colors.accent,
      success: s.colors.success,
      line: s.colors.line,
    },
    fonts: s.fonts,
  },
  css: `
    .sc-stage::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 75%);
    }
  `,
  root: group({
    width: 1280,
    height: 720,
    children: [
      page("a", [
        rect({ x: 64, y: 64, width: 12, height: 12, fill: s.colors.accent }),
        text({
          x: 92,
          y: 58,
          text: "THE HARNESS / 01",
          font: s.fonts.mono,
          size: 15,
          color: s.colors.muted,
          letterSpacing: 4,
        }),
        text({
          x: 64,
          y: 238,
          width: 1152,
          text: "An LLM can write code.",
          size: 92,
          lineHeight: 0.98,
          letterSpacing: "-0.05em",
        }),
        text({
          x: 64,
          y: 430,
          width: 900,
          text: "It still can’t click a button.",
          size: 38,
          color: s.colors.accent,
          letterSpacing: "-0.02em",
        }),
        rect({ x: 64, y: 540, width: 180, height: 3, fill: s.colors.line }),
        text({
          x: 64,
          y: 570,
          text: "TEXT IN  /  TOOL CALL OUT",
          font: s.fonts.mono,
          size: 14,
          color: s.colors.muted,
          letterSpacing: 3,
        }),
        rect({
          x: 980,
          y: 520,
          width: 236,
          height: 92,
          fill: s.colors.panel,
          stroke: s.colors.line,
          strokeWidth: 1,
          radius: 4,
        }),
        text({
          x: 1000,
          y: 548,
          width: 196,
          text: "THERE IS NO HAND.",
          font: s.fonts.mono,
          size: 14,
          color: s.colors.accent,
          letterSpacing: 2,
        }),
      ]),
      page("b", [
        rect({ x: 64, y: 64, width: 12, height: 12, fill: s.colors.accent }),
        text({
          x: 92,
          y: 58,
          text: "THE LOOP / 02",
          font: s.fonts.mono,
          size: 15,
          color: s.colors.muted,
          letterSpacing: 4,
        }),
        text({
          x: 64,
          y: 150,
          width: 1152,
          text: "The model only sends text.",
          size: 62,
          letterSpacing: "-0.04em",
        }),
        ...box("LLM", "TEXT ONLY", 64),
        ...box("HARNESS", "PARSE / RUN", 490, true),
        ...box("TOOLS", "READ / EDIT", 916),
        path({
          d: "M 370 375 C 410 330, 450 330, 484 375",
          width: 1280,
          height: 720,
          viewBox: "0 0 1280 720",
          stroke: s.colors.line,
          strokeWidth: 2,
        }),
        path({
          d: "M 796 375 C 836 330, 876 330, 910 375",
          width: 1280,
          height: 720,
          viewBox: "0 0 1280 720",
          stroke: s.colors.line,
          strokeWidth: 2,
        }),
        text({
          x: 64,
          y: 560,
          width: 1152,
          text: "A tool call is text. The harness turns it into action.",
          size: 30,
          color: s.colors.muted,
        }),
      ]),
      page("c", [
        rect({ x: 64, y: 64, width: 12, height: 12, fill: s.colors.accent }),
        text({
          x: 92,
          y: 58,
          text: "RECAP / 03",
          font: s.fonts.mono,
          size: 15,
          color: s.colors.muted,
          letterSpacing: 4,
        }),
        text({
          x: 64,
          y: 150,
          width: 1152,
          text: "What is a harness?",
          size: 74,
          letterSpacing: "-0.045em",
        }),
        ...box("LLM", "THE CHEF", 64),
        ...box("HARNESS", "THE KITCHEN", 490, true),
        ...box("AGENT", "THE DISH", 916),
        text({
          x: 390,
          y: 345,
          width: 80,
          align: "center",
          text: "+",
          size: 46,
          color: s.colors.muted,
        }),
        text({
          x: 816,
          y: 345,
          width: 80,
          align: "center",
          text: "=",
          size: 46,
          color: s.colors.muted,
        }),
        text({
          x: 64,
          y: 560,
          width: 1152,
          text: "The model is the chef. The harness is the kitchen.",
          size: 30,
          color: s.colors.muted,
        }),
      ]),
    ],
  }),
});
