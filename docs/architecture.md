# Architecture

## The shape

```text
source.md
  → claims.json              (claim ledger: IDs, quotes, numbers, citations)
  → brief.json               (audience, takeaway, duration, style pack, voice)
  → script.md / beats.json   (voice-first narration and scene intentions)
  → scene IR                 (typed, validated, renderer-neutral)
  → compiler                 (archetype → StudioLayer tree)
  → renderer adapter         (StudioLayer → Stagecraft layers)
  → plates / stills          (deterministic pixels)
  → audio / captions         (voice stems, music, SRT/VTT)
  → QA report                (bounds, overflow, collisions, contrast, loudness)
  → handoff                  (manifest, FCPXML/EDL, markers, stems)
  → ffmpeg master            (default)
  → Resolve Studio           (optional polish)
  → site / README / package  (public evidence)
```

## Modules

| Module | Responsibility | Does not |
|---|---|---|
| `src/studio/ir.ts` | Scene IR types, Zod schema, validation | Know about a renderer |
| `src/studio/layers.ts` | Renderer-neutral layer types and helpers | Import Stagecraft |
| `src/studio/style/terminal-editorial.ts` | Tokens, type scale, grid, motion grammar | Contain scene copy |
| `src/studio/scenes/` | Eight archetype builders | Read files or call the network |
| `src/studio/compile.ts` | IR → layer tree, pilot ordering | Render pixels |
| `src/studio/renderers/stagecraft.ts` | Layer tree → Stagecraft composition data | Own visual decisions |
| `src/studio/qa/` | Bounds, overflow, collision, contrast, report | Replace human review |
| `src/studio/audio/` | Timing, SRT/VTT, mix helpers | Synthesize voice by itself |
| `src/studio/handoff/` | Manifest, FCPXML, markers | Edit in Resolve |
| `src/pilot/theo-harness/` | The 90-second content and composition | Leak into `src/studio` |
| `src/site/` | Public static site | Import the private engine |
| `scripts/` | CLI wrappers for render, QA, TTS, handoff | Contain business logic |

## The renderer boundary

`StudioLayer` is a plain data tree:

```ts
type StudioLayer =
  | { type: "group"; x?: number; y?: number; opacity?: number; children: StudioLayer[] }
  | { type: "text"; text: string; x: number; y: number; font: string; size: number; ... }
  | { type: "rect"; x: number; y: number; width: number; height: number; ... }
  | { type: "path"; d: string; ... };
```

It mirrors the Stagecraft layer shape closely enough that the adapter is a mapping, not a translation
layer. The public tests assert the tree and tokens; `src/studio/**` never imports the private engine.
The render-only entries under `src/pilot/**` are the exception: they call `defineComposition` and are
excluded from the public typecheck.

## Determinism

- Every layer property is a constant or a pure function of time.
- No `Date`, `Math.random`, timers or network reads in the render path.
- Scene IR is ordered and validated before compilation.
- The pilot manifest records the engine/browser/ffmpeg versions when rendered locally.
- The public demo is a checked-in artifact; it does not render at page load.

## The pilot composition

The pilot uses the studio archetypes and a thin Stagecraft composition. It is a reference, not a
framework feature. The public repo ships its source and the rendered MP4; a user with a Stagecraft
checkout can re-render it. The site only reads `public/demo/manifest.json` and the committed assets.

## Failure boundaries

- Invalid IR fails before the renderer starts.
- A missing style token fails in the compiler.
- A layout gate fails before the render is published.
- A missing voice/caption file fails the handoff.
- The site never fails because the engine is absent.

## Why not a visual editor

The product is a grammar for one creator and an agent, not a second NLE. The director edits data;
the renderer draws; Resolve finishes. A visual editor would add a second source of truth for timing
and layout and weaken the deterministic loop.
