# Stagecraft Studio

**From a source article to a code-rendered educational motion graphic.**

Stagecraft Studio is a production layer around [Stagecraft](https://github.com/gerrcass/stagecraft):
a typed scene IR, a terminal-editorial style pack, deterministic QA, a voice/caption pipeline and a
Resolve/ffmpeg handoff. It is built for one creator working with an AI agent, not for a render farm.

The first pilot is a 90-second explainer of Theo t3.gg’s “What is a harness?” article.

> **Status:** v0 in progress. The public demo and documentation are being built in the open.

## Why

The reference animation style — kinetic type, counters, diagrams, camera moves, no stock footage —
is code-shaped, not prompt-shaped. An LLM can write the animation, but only if the taste is encoded in
a reusable style pack and the output is checked before it ships. Stagecraft Studio is that
production grammar.

## Layout

- `src/studio/` — scene IR, style pack, renderer adapter, QA, audio and handoff.
- `src/pilot/theo-harness/` — the 90-second pilot.
- `skills/` — seven agent skills for the studio.
- `docs/` — the grilling record, spec, architecture, ADRs and retro.
- `public/demo/` — the rendered pilot, stills and captions.

## Documentation

- [`docs/grilling.md`](docs/grilling.md) — the design tree and decisions.
- [`GLOSSARY.md`](GLOSSARY.md) — the shared language.
- [`docs/adr/`](docs/adr/) — the hard-to-reverse choices.

## License

MIT. The Stagecraft engine is a separate, private project and is not included here.
