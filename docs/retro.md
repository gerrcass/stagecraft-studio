# Retro — Stagecraft Studio v0

**Date:** 26 October 2026. **Scope:** the 90-second harness pilot and the first public release.

## What worked

- **The scene IR was the right seam.** Writing the six scenes as data made the compiler, tests and
  the pilot story legible without a timeline editor. The title, diagram, steps and recap archetypes
  carried the pilot without bespoke layout code.
- **The style pack paid for itself immediately.** Once the palette, type scale, grid and motion
  durations were tokens, the site and the video looked like the same product.
- **Deterministic QA caught real problems.** The first pass found 559 issues; most were inactive
  scenes or auto-height text, but the visible issues were real: the title collided with the scene
  number, the footer sat outside the action-safe box, the diagram labels were too small, and the
  return arrow crossed the boxes. The second pass was clean.
- **Kokoro was good enough for timing.** The scratch voice set the 90-second clock and exposed the
  word budget; replacing it with a human take will not change the composition.
- **ffmpeg was a reliable master.** The final master is 48 kHz stereo, -14.56 LUFS, -4.15 dBTP, and
  the handoff carries the same master plus stems and an FCPXML.
- **Stagecraft was the right renderer.** The private engine rendered 2,705 frames at 1080p30 without a
  browser-specific surprise; the pilot composition is a thin adapter.

## What did not work

- **The pilot entry broke a clean `npm run check`.** `thumbnails.ts` imported `stagecraft` while only
  `composition.ts` was excluded. The local symlink hid it; CI did not. The fix is to exclude all
  render-only pilot entries from the public typecheck and keep the render entry as a local concern.
- **The QA script initially evaluated every scene at every time.** Stagecraft keeps all scenes in the
  DOM; opacity is not inherited in computed styles. `checkVisibility({ checkOpacity: true })` fixed
  it, and the error count dropped from 559 to 23.
- **The QA claims were ahead of the code.** The spec promised phone-width, caption and loudness gates
  before the script implemented them. The fix was to add phone stills, SRT validation and a manifest
  loudness check, and to remove empty-frame/dead-stretch from the v0 contract.
- **Handoff paths were ambiguous.** The manifest used repo-relative paths while the FCPXML used
  bundle-relative paths. The fix is one convention: every asset path is relative to `handoff/`.
- **The site advertised a live URL before Pages existed.** The deploy workflow is now the source of
  truth; the URL is only published after the first successful deploy.
- **The first thumbnail pass overlaid text on stills.** It was unreadable at 320 px. Dedicated
  thumbnail compositions with larger type are the right approach.
- **The public/private boundary was under-documented.** The repo uses a private engine but a public
  demo. The README, spec and ADR now state that the engine is not vendored and the demo is checked in.

## Environment changes for the next run

1. **Typecheck excludes `src/pilot/**`.** Render entries are bundled by the engine; the public gate
   checks the studio layer.
2. **`npm run check` includes `check:agents`.** Seven skills, four agents, six commands and the model
   policy are validated before tests.
3. **`npm run qa` chains the contact sheet.** One command produces the report, the phone stills and
   the sheet.
4. **Caption logic lives in `src/studio/audio/captions.ts`.** It has unit tests and is used by the
   voice script and QA.
5. **Archetype data is validated.** Malformed diagram/compare/steps/code data now fails at the IR
   boundary instead of silently falling back.
6. **Handoff paths are bundle-relative.** The manifest and FCPXML agree.
7. **The model policy is explicit.** `opencode-go/deepseek-v4.1-flash#max` is selected in
   `opencode.json` and every agent.

## Next

- Record the final narration and replace the scratch voice; license a music bed and replace the drone.
- Test `handoff/edit.fcpxml` in Resolve on the target machine.
- Add dead-stretch and empty-frame gates once the 5-minute chapter format exists.
- Build the second style pack (Blueprint) and a second pilot to prove the grammar is not one look.
- Move the 5–12 minute format to chapter-based projects: 5–8 chapters of 60–120 seconds, one shared
  style pack, one assemble step.


See [`session-retro.md`](session-retro.md) for the agent-environment findings (clean checkout, QA input, TTS cache, per-scene render, media duplication).
