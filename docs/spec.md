# Spec — Stagecraft Studio v0

## Problem Statement

A creator with a source article and a private, deterministic renderer (Stagecraft) can make a single
hand-authored motion graphic, but cannot reliably turn a new source into a finished educational video.
Every episode restarts the same work: finding the teaching spine, writing the narration, inventing a
storyboard, hand-coding scenes, recording voice, checking layouts, assembling audio, captions and a
handoff, and packaging the result. The renderer is not the bottleneck; the missing production grammar
is.

The creator also works with an AI agent in OpenCode and wants the agent to do most of the mechanical
work without producing the usual AI tells: drifting layouts, generic dark cards, unreadable text,
dead stretches, mismatched numbers, or a silent film.

## Solution

A studio layer around Stagecraft that makes the production grammar explicit:

1. A **typed scene IR** between the director and the renderer, validated before code is written.
2. A **terminal-editorial style pack**: tokens, motion grammar, eight scene archetypes, reference
   frames and anti-patterns.
3. A **six-scene, 90-second pilot** adapting Theo t3.gg’s “What is a harness?” article, with a
   Kokoro scratch voice, sentence-level captions and a rendered MP4.
4. **Deterministic QA** for bounds, overflow, collisions, minimum type size, known-token contrast,
   caption timing and loudness, plus contact sheets for human review.
5. A **handoff** bundle for ffmpeg or Resolve: plates, stems, SRT, FCPXML/EDL, markers and manifest.
6. **Seven agent skills**, **four OpenCode agents** and commands that make the loop repeatable.
7. A **public static site** with the demo, stills and documentation, deployed to GitHub Pages.

The public repo contains the studio layer, the pilot source and the rendered evidence. The Stagecraft
engine remains private; the adapter is optional and the public site builds from static assets.

## User Stories

1. As a creator, I want to give the studio a source article, so that I get a teachable outline rather
   than a paragraph-by-paragraph summary.
2. As a creator, I want a one-page brief with audience, takeaway, duration and style pack, so that
   every later decision has a reference.
3. As a creator, I want a claim ledger with source IDs, so that every number and quote on screen can
   be traced.
4. As a creator, I want a voice-first script with a word budget, so that the narration sets the
   length instead of the animation.
5. As a creator, I want a beat sheet with one idea per beat, so that the video teaches instead of
   reciting.
6. As a creator, I want a typed scene IR, so that an agent can fill slots without inventing a new
   layout every time.
7. As a creator, I want the IR validated before rendering, so that broken scenes fail cheaply.
8. As a creator, I want a style pack with tokens and motion rules, so that 60 scenes look like one
   film.
9. As a creator, I want eight scene archetypes, so that I can choose a shape before a picture.
10. As a creator, I want a 90-second pilot with six scenes, so that I can judge the grammar before
    committing to a 10-minute episode.
11. As a creator, I want a Kokoro scratch voice, so that I can time the animatic without paying for
    TTS.
12. As a creator, I want to replace the scratch voice with my own recording, so that the final film
    has human narration.
13. As a creator, I want sentence-level SRT/VTT captions, so that the video is accessible and
    reviewable.
14. As a creator, I want a deterministic QA report, so that clipped text and unreadable type are
    caught before a human watches.
15. As a creator, I want contact sheets at scene midpoints and phone width, so that I can review the
    whole film at a glance.
16. As a creator, I want a loudness-normalized mix, so that the video is ready for YouTube.
17. As a creator, I want a handoff bundle with plates, stems, SRT and an edit decision, so that I can
    finish in Resolve without rebuilding the scenes.
18. As a creator, I want ffmpeg to be the automated master, so that the pipeline is reproducible
    without a GUI.
19. As a creator, I want a title, description, chapter list and three thumbnail bets, so that the
    video is packaged, not just rendered.
20. As an agent, I want a `SKILL.md` for the studio contract, so that I know the commands and the
    determinism rules.
21. As an agent, I want a director skill, so that I can turn a source into a brief, script and beats.
22. As an agent, I want a design skill, so that I can apply the style pack without guessing.
23. As an agent, I want a scene-coder skill, so that I can compile the IR into renderer layers.
24. As an agent, I want a sound/captions skill, so that I can generate voice, align it and build SRT.
25. As an agent, I want a QA skill, so that I can inspect stills and return a fix list.
26. As an agent, I want a handoff skill, so that I can write a Resolve-ready bundle.
27. As an agent, I want a packaging skill, so that I can produce titles, thumbnails and chapters.
28. As a reviewer, I want a public demo page, so that I can judge the output without installing the
    private engine.
29. As a reviewer, I want the README to include a screenshot and a live link, so that the project is
    legible at a glance.
30. As a maintainer, I want tests for the IR, compiler, QA, captions and handoff, so that changes do
    not silently break the grammar.
31. As a maintainer, I want a single `npm run check` gate, so that CI and local review use the same
    contract.
32. As a maintainer, I want a GitHub Pages deploy on `main`, so that the demo stays current.
33. As a maintainer, I want every ticket closed by a PR, so that the tracker is truthful.
34. As a maintainer, I want a retro after the pilot, so that the next episode is cheaper.

## Implementation Decisions

- **Renderer boundary.** The studio emits a renderer-neutral `StudioLayer` tree that mirrors
  Stagecraft’s layer shape. The Stagecraft adapter is a thin mapping; the public tests do not import
  the private engine. HyperFrames and Remotion are documented alternatives, not implemented in v0.
- **Scene IR as the seam.** A Zod schema validates `SceneIR` objects: `id`, `archetype`, `start`,
  `duration`, `narration`, `eyebrow`, `headline`, `body`, `data`, `claimIds`, `transition`. The
  compiler rejects unknown archetypes, duplicate IDs, overlapping scenes, missing narration and
  out-of-range durations.
- **Style pack.** `terminal-editorial` is a plain data module: colors, fonts, type scale, grid,
  spacing, stroke widths, motion curves, durations, safe areas and archetype limits. It is the only
  source of visual constants in the compiler.
- **Archetypes.** `title`, `statement`, `diagram`, `compare`, `steps`, `recap`, `quote`, `code`.
  Each returns a `StudioLayer` tree with deterministic positions and a small number of motion
  functions. v0 uses six in the pilot; the other two are tested but not rendered.
- **Pilot.** Six scenes, 90 seconds, 1920×1080, 30 fps. The script is ~220 words. The scratch voice is
  Kokoro (`am_michael`); the final voice is a replaceable stem. Music is a low, licensed/free ambient
  bed; SFX are exact and sparse.
- **Audio.** Per-scene WAV files are generated from the script; `ffprobe` measures durations; the
  pilot’s scene durations are derived from the voice plus a small hold. The mix uses ffmpeg
  `loudnorm` targeting -14 LUFS integrated / -1 dBTP. Captions are sentence-level SRT/VTT.
- **QA.** Deterministic checks run on the exported HTML through Playwright: text bounds, overflow,
  collisions, minimum type size, known-token contrast, empty frames, dead stretches and caption
  timing. Contact sheets are built with ffmpeg. Vision review is optional and never the only gate.
- **Handoff.** The bundle contains `plates/` (PNG frames or ProRes if available), `audio/` stems,
  `captions/`, `edit.fcpxml`, `markers.csv`, `manifest.json` and `NOTE.md`. ffmpeg is the master;
  Resolve Studio is the optional polish pass.
- **Site.** Vite + TypeScript, no framework. The site reads a static `public/demo/manifest.json` and
  shows the MP4, stills, pipeline, skills and docs. GitHub Pages deploys via Actions.
- **Model policy.** The build uses `opencode-go/deepseek-v4.1-flash#max` only. No model-specific
  behavior is encoded in the studio.
- **Licensing.** Studio code is MIT. Stagecraft is a separate private engine and is not included.
  Music/SFX must carry a license record; the pilot uses a generated/low-risk bed and bundled SFX.

## Testing Decisions

Good tests assert external behavior: the IR accepts valid scenes and rejects invalid ones; the
compiler returns the expected archetype root and text; the QA checks flag an overflowing box and pass
a clean one; captions produce valid SRT timestamps; the handoff manifest contains the required keys
and hashes. Tests do not assert private helper structure or pixel identity.

Seams:

1. **IR validation** — pure function, highest seam; covers every archetype and every rejection.
2. **Compiler** — pure `compileScene` / `compilePilot`; asserts layer shape, text, tokens and timing.
3. **QA** — pure checks on synthetic boxes; the Playwright adapter is tested manually.
4. **Captions/timing** — pure SRT and scene-timing functions.
5. **Handoff** — pure manifest/FCPXML builders.
6. **Site** — build succeeds; the page contains the demo link and title.
7. **Pilot render** — manual integration: MP4 exists, is 90 s ± 2 s, has audio, passes `ffprobe`,
   contact sheet and the QA report.

Prior art: Stagecraft’s own unit/DOM split; the repo’s `npm run check` is the single gate.

## Out of Scope

- A visual timeline editor, multi-user collaboration, hosted rendering, a SaaS.
- A new renderer, generative video for core visuals, 3D, character animation, physics.
- A full NLE, a music-generation model, voice cloning, automated publishing.
- A 5–12 minute episode in v0; the pilot proves the grammar for one.
- Publishing the Stagecraft engine or its private assets.
- Multi-language versions, A/B thumbnail testing at scale, analytics.

## Further Notes

The creator’s stack — Opus 5.5, custom design skills, ffmpeg, Resolve — is the architecture, not a
single tool. The studio is the “custom design skills” layer plus the production loop. The public
artifact is the grammar; the private engine stays private. The pilot is the first proof, not the
finished channel.

The reference clip is a 2019-style dark kinetic-typography study; the pilot borrows its discipline
(one accent, one idea per shot, 0.2–0.6 s ease-out, holds, continuous camera moves) without copying
its assets or exact frames.

## Acceptance

- `npm run check` passes, including typecheck, unit tests and site build.
- The pilot MP4 is checked in under `public/demo/`, 90 s ± 2 s, 1920×1080, 30 fps, with audio.
- The QA report passes bounds/overflow/contrast/type-size gates for every scene midpoint.
- The SRT is valid and matches the narration.
- The site is deployed to GitHub Pages and linked from the README.
- The README includes a representative screenshot.
- The public repo contains no Stagecraft source, secrets or unlicensed media.
