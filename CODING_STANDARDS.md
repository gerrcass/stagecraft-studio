# Coding standards

Stagecraft Studio is a small TypeScript toolkit. These are the rules a reviewer should enforce.

## Types and boundaries

- TypeScript strict; no `any`, no non-null `!` without a comment, no `as` casts that hide a real
  shape.
- The studio layer is renderer-neutral. `src/studio/**` never imports the private engine; the
  render-only pilot entries under `src/pilot/**` may import it through the adapter.
- Scene IR is validated at the boundary. Internal code may assume the validated type.
- Public functions have explicit return types when the inference is not obvious.

## Determinism

- No `Date`, `performance.now`, timers, network reads or unseeded `Math.random` in the render path.
- Layout data is computed once at module load or inside a pure function of time.
- Scene order is explicit; do not rely on object key order.

## Style and content

- Colors, fonts, sizes, spacing, strokes and eases come from the style pack. A literal in a scene is
  a finding unless it is a one-off geometric coordinate.
- One idea per scene; one focal point per frame. The reviewer rejects a frame that cannot be read at
  360 px.
- Copy is voice-first, concrete and free of “unlock”, “seamless”, “supercharge”, “revolutionize” and
  “in seconds” unless measured.
- Numbers and labels trace to a claim ID.

## Tests

- Test external behavior: validation results, compiled text/layers, QA findings, SRT, manifest,
  FCPXML.
- Prefer one high seam over many mocks. The compiler and QA checks are pure; test them directly.
- A visual change needs a still or a written reason, not only a green test.
- Every bug fix gets a regression test unless the bug is purely visual and the evidence is a still.

## Assets and licenses

- No secrets, private keys, `.env` files or Stagecraft source in the repo.
- Every font, music track, sound effect and image has a license record.
- The demo is checked in; it must not require a network fetch to play.

## Accessibility

- Reading text at least 28 px at 1080p; metadata labels at least 14 px; captions separate and accurate.
- The site has readable contrast, keyboard focus and a text alternative for the demo.
- The video has a poster and a transcript/SRT.

## Review tone

- Report findings by severity, with file and line references.
- Separate “must fix” from “judgement call”; a documented standard beats a smell.
- Do not rewrite the author’s voice; fix the behavior, not the personality.
