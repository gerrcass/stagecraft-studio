# Stagecraft Studio

Production layer for turning a source article into a code-rendered educational motion graphic. The
renderer is Stagecraft, a separate private engine reached through an adapter; this repo owns the scene
IR, style pack, QA, audio, handoff and the pilot.

## Read in this order

1. `GLOSSARY.md` — the studio’s language.
2. `docs/grilling.md` — the design tree and the decisions taken.
3. `docs/adr/` — the hard-to-reverse choices.
4. `docs/spec.md` — the v0 contract.
5. `docs/architecture.md` — module seams and the renderer boundary.

## Commands

```bash
npm install
npm run check        # typecheck, unit tests, site build
npm run dev          # local site
npm run build        # static site
```

The full pilot render needs a Stagecraft checkout and is documented in `docs/spec.md`.

## Agent skills

### Issue tracker

GitHub Issues on `gerrcass/stagecraft-studio`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Non-negotiables

- **One model:** `opencode-go/deepseek-v4.1-flash#max` only.
- **Scene IR is the seam:** the director writes data, not free-form scene code.
- **Deterministic before visual:** bounds, overflow, contrast and loudness are checked before any
  vision review.
- **The demo is public, the engine is not:** commit the rendered pilot, never Stagecraft’s source.
- **Every change has evidence:** a still, a test, a manifest or a written reason.
