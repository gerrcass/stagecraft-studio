---
name: sound-captions
description: Generate the scratch voice, derive scene timings, mix music and effects, and write SRT/VTT captions for Stagecraft Studio. Use when the script is approved and the visuals need a clock.
---

# Sound and captions

The voice is the clock. Generate it before locking scene durations, then let the visuals land on the
words.

## Voice

- Scratch: Kokoro `am_michael` (or the project’s chosen voice) through
  `npx hyperframes tts "<line>" --voice am_michael --output audio/voice/01.wav`.
- Final: the creator’s own recording. Keep the same file names so the composition does not change.
- One file per scene, 48 kHz mono WAV; keep the raw takes and a `voice.json` manifest.
- Use a pronunciation lexicon for product names and jargon; re-record a line rather than fixing it
  with pitch.

## Timing

1. Generate one WAV per scene.
2. Measure durations with `ffprobe`.
3. Add a deliberate hold: 0.4–0.8 s after the last word, longer for a definition or a recap.
4. Set `start` and `duration` in the scene IR; the total is the sum, not a guessed target.
5. Re-render the stills at each scene midpoint; check that the last visual lands on the last word.

## Music and effects

- A low ambient bed at about -28 dB under the voice; duck 15–20 dB while speech is present.
- Effects are exact and sparse: a click on a real click, a whoosh on a cut, a soft tick on a
  typewriter, a pop on a number landing. No chimes, dings or risers unless the story earns one.
- Keep a `licenses.json` with source, license, attribution and date for every track.

## Captions

- Sentence-level SRT/VTT from the script and the measured timings.
- Break on meaning, not at a character limit; keep two lines maximum.
- Names, numbers and product terms are checked against the script.
- Offer the SRT as a separate file; burn-in is optional and must not cover the diagram.

## Mix

- Target -14 LUFS integrated and -1 dBTP; use ffmpeg `loudnorm`.
- Check with `ffprobe` and a loudness pass; sound is measured, not assumed.
- Export stems: `voice.wav`, `music.wav`, `sfx/`, `mix.wav`.

## Completion criteria

- Every scene has a voice file and a measured duration.
- The total is within 2 s of the target.
- SRT/VTT timestamps are monotonic and match the voice.
- The mix is at the target loudness and the music does not mask the voice.
- A human has listened once with headphones and once on a phone speaker.
