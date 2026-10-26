---
name: resolve-handoff
description: Build the Resolve/ffmpeg handoff for Stagecraft Studio: plates, stems, captions, FCPXML/EDL, markers, manifest and a note. Use after picture lock, before finishing.
---

# Resolve handoff

The renderer makes plates; ffmpeg makes the automated master; Resolve Studio is the optional finishing
room. Do not rebuild the scenes in Resolve.

## Bundle

```text
handoff/
  plates/            # PNG or ProRes 4444, one per scene, 12–24 frame handles if available
  audio/
    voice/           # one WAV per scene
    music/           # licensed bed
    sfx/             # exact effects
    mix.wav          # -14 LUFS / -1 dBTP
  captions/
    theo-harness.srt
    theo-harness.vtt
  edit.fcpxml        # FCPXML 1.9 or EDL
  markers.csv        # scene IDs, start, end, label
  manifest.json      # durations, fps, hashes, sources, licenses
  NOTE.md            # real vs illustrative, open issues, what to check
```

## Rules

- ffmpeg is the master. The `npm run handoff` script must produce a playable MP4 without Resolve.
- Resolve external scripting requires **Studio**; free Resolve uses the interchange files manually.
- Keep captions separate from the picture unless the style explicitly burns them in.
- Do not bake in colour grades, final titles or a final mix that the handoff should own.
- Record the source of every asset; no unlicensed music or fonts.
- The manifest is the source of truth for durations, hashes and versions.

## Completion criteria

- `manifest.json` validates and lists every plate, stem and caption.
- `edit.fcpxml` parses as XML and imports into Resolve (test once on the target machine).
- `markers.csv` matches the scene IR.
- A human can open the bundle and understand what is real, what is illustrative and what is missing.
- The ffmpeg master plays end to end with audio and captions.
