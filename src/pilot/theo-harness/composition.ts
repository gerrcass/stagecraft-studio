import { defineComposition } from "stagecraft";
import { compilePilot } from "../../studio/compile.js";
import { theoHarnessPilot } from "../../studio/pilot/theo-harness/pilot.js";
import { toStagecraftComposition } from "../../studio/renderers/stagecraft.js";
import { terminalEditorial } from "../../studio/style/terminal-editorial.js";

const compiled = toStagecraftComposition(compilePilot(theoHarnessPilot, terminalEditorial));

export default defineComposition({
  id: compiled.id,
  title: compiled.title,
  description: compiled.description,
  accessibility:
    "A dark editorial explainer. An LLM cannot click a button; humans use interfaces; a harness parses the model's text, runs tools and returns results. The film names the five parts of a harness, compares the interface and the harness, and ends with an agent as an LLM plus a harness.",
  size: compiled.size,
  fps: compiled.fps,
  duration: compiled.duration,
  posterAt: Math.max(0, compiled.duration - 2),
  beats: Object.fromEntries(
    compiled.scenes.map((scene) => [scene.id, [scene.start, scene.start + scene.duration]]),
  ),
  theme: {
    name: compiled.theme.name,
    colors: {
      background: terminalEditorial.colors.background,
      text: terminalEditorial.colors.text,
      muted: terminalEditorial.colors.muted,
      accent: terminalEditorial.colors.accent,
      success: terminalEditorial.colors.success,
      line: terminalEditorial.colors.line,
    },
    fonts: terminalEditorial.fonts,
    spacing: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 },
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
      background-size: 72px 72px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 75%);
    }
  `,
  root: compiled.root,
});
