# Design grilling — Stagecraft Studio

**Session date:** 26 October 2026. **Mode:** self-grilling with delegated decisions. The user asked
for a relentless grill but explicitly delegated the answers; this document records the design tree,
the recommended answer for each frontier question, and the decision taken. It follows the same
round structure as `/grill-with-docs`.

The objective: turn a source article into a **90-second, 1080p, narrated, captioned motion-graphics
pilot** using Stagecraft, and package the reusable production layer — skills, agents, scene IR,
style pack, QA and handoff — as a public project.

---

## Round 1 — Product boundary

❓ **Q1 — What is the product?**
A studio toolkit for one creator and their agents, a reusable production system, a hosted SaaS, or a
new renderer?

➡️ A **studio toolkit plus a reference pilot**. It sits around Stagecraft and turns a source into
scene IR, a composition, audio, captions, QA evidence and a Resolve/ffmpeg handoff. It is not a SaaS,
not a new renderer, and not a general NLE.

**Decision:** studio toolkit + pilot. The public artifact is the production grammar, not the engine.

❓ **Q2 — Who is the user?**
The creator, an AI agent, a team of creators, or an external customer?

➡️ A **solo creator working with an agent** in OpenCode. Every artifact must be legible to both: typed
data, plain Markdown, deterministic scripts, and a human review gate.

**Decision:** single-creator, agent-first, human-finished.

❓ **Q3 — What does success look like for v0?**
A polished 5–12 minute episode, a 90-second pilot, a reusable engine, or a product launch?

➡️ A **90-second pilot from Theo’s “What is a harness?” article**, published as a demo, with the
production layer reusable for longer episodes. The pilot proves the grammar; it is not the whole
channel.

**Decision:** 90-second pilot + reusable layer.

❓ **Q4 — What is explicitly out of scope?**
A visual editor, multi-user collaboration, a hosted render farm, generative video, a full NLE, a
music-generation model, or an npm-published Stagecraft?

➡️ All of them. v0 uses code, local rendering, Kokoro, ffmpeg and optional Resolve. Generative video
is not used for text or diagrams. Stagecraft remains a private peer dependency; the public repo ships
the studio layer and a pre-rendered demo.

**Decision:** no editor, no SaaS, no generative video, no engine publication, no full NLE.

---

## Round 2 — Authoring and rendering

❓ **Q5 — What is the authoring seam?**
Free-form TypeScript per video, a JSON scene IR compiled to TypeScript, a visual timeline, or a
prompt-only workflow?

➡️ A **typed scene IR** (`scene-ir.schema.json` / TypeScript types) is the seam. The director writes
`script.md` and `beats.json`; the scene IR encodes archetype, narration, on-screen text, data,
citations, duration and transition. A compiler turns it into Stagecraft layers. This keeps 60 scenes
consistent and testable.

**Decision:** scene IR is the authoring seam; free-form code is the escape hatch.

❓ **Q6 — Which renderer?**
Stagecraft, HyperFrames, Remotion, or a new one?

➡️ **Stagecraft** as the primary renderer, behind a small `RendererAdapter` interface. It already
reproduces the reference look and is deterministic. HyperFrames is the bake-off/fallback; Remotion is
the React fallback. The public repo does not vendor the private engine.

**Decision:** Stagecraft primary; adapter boundary; HyperFrames/Remotion documented alternatives.

❓ **Q7 — How does the public demo build without the private engine?**
Publish Stagecraft, vendor it, use a fake renderer, or commit pre-rendered artifacts?

➡️ **Commit pre-rendered evidence** (MP4, stills, SRT, manifest) and keep the Stagecraft adapter
optional. The public site builds from static assets; the full render runs locally with a Stagecraft
checkout. Unit tests use the IR and fake layers, not the engine.

**Decision:** pre-rendered demo + optional Stagecraft peer.

❓ **Q8 — What is the visual system?**
Copy the reference exactly, use a generic template, or build a style pack?

➡️ A **terminal-editorial style pack** inspired by the reference: near-black ground, off-white ink,
one orange accent, green success, Helvetica-class display, mono micro-labels, strict grid, 0.2–0.6 s
cubic ease-out, no bounce. It is a system, not a copy of the creator’s assets.

**Decision:** one style pack with tokens, motion grammar, layouts and references.

❓ **Q9 — How long is the pilot and how many scenes?**
30 s, 90 s, 5 min, or 12 min?

➡️ **90 seconds, six scenes, ~220 words.** Enough to prove a cold open, a mechanism diagram, a
definition, an analogy and a recap without waiting for a 10-minute render.

**Decision:** 90 s / 6 scenes / ~220 words.

---

## Round 3 — Sound, QA and finishing

❓ **Q10 — How is voice produced?**
TTS only, human only, or scratch TTS then human?

➡️ **Kokoro scratch voice** for timing and animatics; a human recording is the final quality path.
Kokoro is Apache-2.0, local, and good enough to validate pacing. The pipeline must support replacing
the voice without changing the composition.

**Decision:** Kokoro scratch + human final; voice is a replaceable stem.

❓ **Q11 — How is music handled?**
Generate it, use a library, or go silent?

➡️ A **low ambient bed** for the pilot, sourced from a licensed/free library, plus a few exact SFX.
No generative music in v0. The mix targets -14 LUFS integrated / -1 dBTP, with music ducked under the
voice.

**Decision:** licensed/free bed + exact SFX; ffmpeg loudnorm; optional Resolve mix.

❓ **Q12 — What is the QA gate?**
Human eyeballing, a VLM judge, deterministic checks, or all three?

➡️ **Deterministic checks first**, then contact sheets, then optional vision review. Check text
bounds, overflow, collisions, minimum type size, known-token contrast, caption timing and loudness.
A VLM is a second opinion, never the only gate. The pilot must pass a written checklist.

**Decision:** deterministic + contact sheet + optional vision; human final.

❓ **Q13 — What is the finishing boundary?**
Finish in Stagecraft, ffmpeg, Resolve, or a custom NLE?

➡️ **ffmpeg is the automated master**; **Resolve Studio is an optional polish pass**. The handoff
includes plates, stems, SRT, FCPXML/EDL, markers and a manifest. Free Resolve is manual; external
scripting needs Studio.

**Decision:** ffmpeg master, optional Resolve Studio, explicit handoff.

❓ **Q14 — What is in the public repo?**
Only skills, only the pilot, the full engine, or the studio layer + demo?

➡️ The **studio layer + demo + docs**: scene IR, style pack, components, QA/handoff scripts, seven
skills, four agents, the pilot source and pre-rendered evidence. No Stagecraft source, no private
assets, no unlicensed media.

**Decision:** public studio layer + demo; private engine stays private.

---

## Round 4 — Delivery and operations

❓ **Q15 — How is the project tracked?**
GitHub Issues, local Markdown, Linear, or a doc?

➡️ **GitHub Issues** with the canonical triage labels, a spec issue, and tracer-bullet tickets with
blocking edges. PRs close tickets.

**Decision:** GitHub Issues; labels `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`.

❓ **Q16 — How is the site deployed?**
GitHub Pages, Vercel, Netlify, or a local file?

➡️ **GitHub Pages** via Actions, a static Vite build, with the demo MP4 and stills in `public/`.
The README links the live site and includes a representative screenshot.

**Decision:** GitHub Pages.

❓ **Q17 — What is the model policy?**
Any OpenCode Go model, Claude Opus, or one model?

➡️ **DeepSeek V4.1 Flash `#max` only** for this build. The user asked for it explicitly. The design
must not depend on model-specific behavior; a future model can replace it.

**Decision:** DeepSeek V4.1 Flash #max only.

❓ **Q18 — What is the review loop?**
One agent, two independent reviewers, or a full code-review skill?

➡️ **Two independent subagents per round, two rounds**, comparing Standards and Spec findings,
refining the dispatch between rounds. Then `/pr` with evidence, merge, `/retro`.

**Decision:** two reviewers × two rounds before the PR.

---

## Frontier status

All decisions settled. The design tree is closed for v0. The remaining work is implementation, not
discovery. Revisit only if the pilot fails the “would publish” bar or if Stagecraft’s adapter proves
too costly.
