---
name: stagecraft-design
description: Apply the terminal-editorial style pack and choose a scene archetype for Stagecraft Studio. Use when storyboarding, writing scene IR, laying out a frame, choosing motion, or reviewing a still for style drift.
---

# Stagecraft design

The look is a system, not a mood. The reference is a dark editorial motion study: one accent, a strict
grid, a small type scale, calm cubic ease-out and holds that let the viewer read.

## The style pack

Read `src/studio/style/terminal-editorial.ts`. It is the only source of visual constants.

- Ground `#0A0A0A`, ink `#F2F2F2`, muted `#8E8E8E`, accent `#FF5100`, success `#00D178`, line `#3B3B3B`.
- Display: TeX Gyre Heros; mono: Roboto Mono. Three display sizes, two mono sizes.
- 12-column grid, 120 px margins at 1920×1080, 90% action-safe, 80% title-safe.
- Strokes 2–3 px; radii 4 px; no gradients, no glow, no floating cards.
- Motion: 0.2–0.6 s cubic/quintic ease-out; no bounce; one hero move per shot; hold the last frame
  at least 1.5 s.

## Choose the archetype before the picture

| Shape of the line | Archetype |
|---|---|
| A claim, a turn, a definition | `statement` |
| A number that lands | `statement` with a counter |
| A mechanism or process | `diagram` |
| Two things that differ | `compare` |
| A sequence of steps | `steps` |
| A quote or a line to remember | `quote` |
| Code or a tool call | `code` |
| The takeaway | `recap` |

Do not use a bullet slide, three cards in a row, icons in circles, or a finished diagram dropped on
screen at once. Build one diagram and grow it.

## Layout rules

- One focal point per frame; the hero fills at least 40% of the frame’s height or width.
- Reading text at least 28 px at 1080; display at least 72 px; metadata labels 14–15 px; no text under 14 px.
- Keep reading text inside 80% title-safe; keep all content inside 90% action-safe.
- One accent word per frame; emphasis comes from scale, inversion or density, not a third colour.
- Labels sit on the part they name; no legend, no bullet list.

## Motion rules

- Enter on the back half of the scene, when the voice names the thing.
- One hero move; secondary moves travel 50–70% as far and start 100–200 ms later.
- Typewriter only when the act of typing is the idea; otherwise reveal whole lines.
- Counters land on the exact number and hold; no bounce on data.
- No idle drift, breathing or floating loops on titles.

## Completion criteria

- Every colour, font, size and duration comes from the style pack.
- The scene reads at 360 px wide.
- The still has one focal point and no collision.
- The motion has a reason in the narration, not decoration.
- A human can say what the frame is in one sentence without reading the script.
