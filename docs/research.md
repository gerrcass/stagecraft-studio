# Research — why this shape

The project started from a simple question: can an agent turn a topic into a polished motion-graphic
explainer? The research says yes, but not with a single one-click tool, and not with a generative
video model.

## The reference

The reference clip is an 8.3-second, 1088×960 dark editorial motion study: a 10×10 agent grid, a
counter, a funnel, a camera move, typewriter text and a drawn check. It is code-shaped: precise
labels, exact numbers, vector diagrams, deterministic timing. The creator’s disclosed stack is
“Opus 5.5, ffmpeg, custom design skills and DaVinci Resolve, via Claude Code or Cursor.” That is a
**hybrid**: an LLM writes code, a design skill encodes taste, ffmpeg assembles, and Resolve finishes.

## What the landscape showed

- **No shipping product** turns a bare topic into a 5–12 minute, technically accurate, visually custom
  explainer. Gemini Notebook gives 6–7 minute narrated slides; HeyGen/Synthesia give 3-minute
  presenter-led videos with preset or code-generated graphics; InVideo/Pictory/Fliki give stock
  montages.
- **Generative video** is the wrong substrate for the core. It caps at 8–30 seconds per generation,
  and text fidelity remains poor: the best word error rate in VTR-Bench (Oct 2026) was 0.250, and
  localized text editing is still the bottleneck. It is useful for b-roll, not for diagrams.
- **Code-to-video is the credible route.** HeyGen’s Code2Video benchmark (168 briefs, 16 models)
  found brief-following is nearly solved and craft is not; open-weight models are within 50 Elo of the
  top, and every model still loses to the human reference.
- **The closest full system** is HyperFrames (Apache-2.0, HTML/CSS/GSAP → deterministic MP4, seven
  agent skills, OpenCode support, audio/captions, browser editor, a free local Kokoro voice, and a
  dedicated explainer workflow). Remotion is the mature React alternative. Stagecraft already
  reproduces the reference and is the engine this project owns.
- **The missing layer in every tool** is a user-owned design system and production grammar: a style
  pack, a typed scene IR, deterministic QA, audio/captions and a clean handoff. That is what this
  repo builds.

## The decision

Keep Stagecraft as the renderer, behind an adapter. Build the studio layer: scene IR, terminal-editorial
style pack, six-scene pilot, QA, captions, handoff and packaging. The public repo ships the layer,
the pilot source and the rendered evidence; the private engine is not vendored.

The build uses **only** `opencode-go/deepseek-v4.1-flash#max`, per the project owner. The architecture is
model-agnostic: the design skill, scene IR and QA do the heavy lifting.

## Further reading

The original research notes live outside this repo in the author’s workspace. The short version:

- `docs/grilling.md` — the design tree and decisions.
- `docs/spec.md` — the v0 contract.
- `docs/architecture.md` — the module seams.
- `docs/adr/` — the hard-to-reverse choices.
- `handoff/` — the Resolve/ffmpeg bundle and measured loudness.
