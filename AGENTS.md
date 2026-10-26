# Stagecraft Studio

Production layer for turning a source article into a code-rendered educational motion graphic. The
renderer is Stagecraft, a separate private engine reached through an adapter; this repo owns the scene
IR, style pack, QA, audio, handoff, pilot and public site.

## Start here

1. `GLOSSARY.md` — the studio’s language.
2. `docs/grilling.md` — the design tree and the decisions.
3. `docs/spec.md` — the v0 contract.
4. `docs/architecture.md` — module seams and the renderer boundary.
5. `docs/adr/` — the hard-to-reverse choices.

## Where to look

| Task | Read |
|---|---|
| Start or resume a production | `skills/studio/SKILL.md` |
| Source → brief → script → beats | `skills/explainer-director/SKILL.md` |
| Choose an archetype, apply the look | `skills/stagecraft-design/SKILL.md` |
| Voice, timing, mix, captions | `skills/sound-captions/SKILL.md` |
| QA gates and fix lists | `skills/video-qa/SKILL.md` |
| Plates, stems, FCPXML, markers | `skills/resolve-handoff/SKILL.md` |
| Title, thumbnails, chapters | `skills/youtube-packaging/SKILL.md` |
| Coding rules for review | `CODING_STANDARDS.md` |

## Commands

```bash
npm install
npm run check          # typecheck, unit tests, site build
npm run dev            # local site
npm run build          # static site
npm run qa             # deterministic checks + contact sheet
npm run render:pilot   # pilot render with a Stagecraft checkout
npm run handoff        # Resolve/ffmpeg bundle
```

The full pilot render needs a Stagecraft checkout; see `docs/spec.md`. The public site builds from
`public/demo/` and never imports the engine.

## Agents and skills

The project is configured for OpenCode v2 in `opencode.json`. Seven skills live in `skills/`; four
agents live in `.opencode/agents/`; commands live in `.opencode/commands/`.

- **director** — brief, script, beats, continuity, final cut.
- **scene-coder** — scene IR → renderer layers, tests.
- **visual-qa** — read-only QA from stills and contact sheets.
- **packaging** — title, thumbnails, description, chapters.

## Non-negotiables

- **One model:** `opencode-go/deepseek-v4.1-flash#max` only.
- **Scene IR is the seam:** the director writes data; the compiler writes layers.
- **One source of visual truth:** every colour, font, size and ease comes from the style pack.
- **Deterministic before visual:** bounds, overflow, contrast and loudness are checked before any
  human or vision review.
- **The demo is public, the engine is not:** commit the rendered pilot, never Stagecraft’s source.
- **Every change has evidence:** a still, a test, a manifest or a written reason.
- **Close the loop:** a ticket is done when its PR is merged and its evidence is in the repo.
