---
name: studio
description: Start, resume or route a Stagecraft Studio production. Use when turning a source into a scene IR, scene code, render, QA, captions, handoff or a packaged video; also the index for the other studio skills.
---

# Studio

Stagecraft Studio turns a source article into a code-rendered educational motion graphic. The
renderer is Stagecraft, a separate private engine; this repo owns the grammar, style pack, QA, audio,
handoff and site.

## Read first

1. `GLOSSARY.md` — the studio’s language.
2. `docs/grilling.md` — the decisions and the boundary.
3. `docs/spec.md` — the v0 contract.
4. `docs/architecture.md` — the module seams.
5. `docs/adr/` — the hard-to-reverse choices.

## Model policy

Use only `opencode-go/deepseek-v4.1-flash#max` for this project. Do not switch models, and do not
encode model-specific behavior in the product.

## The loop

1. **Source → claims.** Extract claims, quotes, numbers and citations into `claims.json`.
2. **Brief.** Audience, takeaway, duration, style pack, voice and constraints in `brief.json`.
3. **Script → beats.** Voice-first narration, one idea per scene, with claim IDs.
4. **Scene IR.** Typed, validated, renderer-neutral. Reject invalid scenes before code.
5. **Compile → render.** Use the `stagecraft-design` skill for layout and motion; use
   `npm run check` before a render.
6. **QA.** Use `video-qa`; fix every error before showing a still.
7. **Sound/captions.** Use `sound-captions`; the voice is the clock.
8. **Handoff.** Use `resolve-handoff`; ffmpeg is the master, Resolve is optional.
9. **Package.** Use `youtube-packaging`; do not publish without a title, thumbnail and evidence.
10. **Retro.** Write what changed and what the next episode should do differently.

## Skills

| Skill | Reach for it when |
|---|---|
| `explainer-director` | Turning a source into a brief, claim ledger, script and beats |
| `stagecraft-design` | Choosing an archetype, applying tokens, reviewing motion |
| `sound-captions` | Generating voice, timing scenes, mixing, making SRT/VTT |
| `resolve-handoff` | Writing plates, stems, FCPXML/EDL, markers and a manifest |
| `youtube-packaging` | Titles, thumbnails, description, chapters, private upload |
| `video-qa` | Checking stills, overflow, contrast, contact sheets, fix lists |

## Commands

```bash
npm run check          # typecheck, tests, site build
npm run dev            # local site
npm run build          # static site
npm run qa             # deterministic checks + contact sheet
npm run render:pilot   # render the 90 s pilot with a Stagecraft checkout
npm run handoff        # write the Resolve/ffmpeg bundle
```

## Completion criteria

A production is done when the scene IR validates, `npm run check` passes, the QA report has no
errors, the master has audio at -14 LUFS / -1 dBTP, the SRT matches the voice, the handoff bundle is
complete, and a human has watched the cut once.
