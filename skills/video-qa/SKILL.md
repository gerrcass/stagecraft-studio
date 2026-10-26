---
name: video-qa
description: Review a Stagecraft Studio scene or cut for bounds, overflow, collisions, contrast, type size, dead stretches, caption timing and style drift. Use after a render and before showing the work.
---

# Video QA

Measure first; look second. A clipped label or a 0.6 s line looks fine in a contact sheet and fails
on a phone.

## Gates

| Gate | What it catches | How |
|---|---|---|
| Bounds | text or shapes outside 90% action-safe | DOM bounding boxes |
| Overflow | text clipped by its own box | `scrollWidth`/`scrollHeight` |
| Collision | two focal elements overlapping | rect intersection |
| Type floor | reading text under 28 px at 1080 | computed font size |
| Contrast | ink on ground under 3:1 | token pairs / sampled pixels |
| Empty frame | first frame or a dead scene | pixel variance |
| Dead stretch | more than 3 s with nothing changing | frame diff |
| Caption drift | cue not matching the voice | word timestamps |
| Loudness | quiet or clipped mix | ffprobe / loudnorm |

## Process

1. Run `npm run qa`; read `qa/report.json`.
2. Fix every error. Warnings are questions: fix or record why not.
3. Open the contact sheet and the phone-width sheet; describe each frame in one sentence.
4. Compare the frames to `docs/spec.md`; a frame that does not serve the takeaway is a finding.
5. Fix text first, timing second, detail third.
6. Re-run the gates on the changed scenes only.

## Rules

- A VLM is a second opinion, never the only gate.
- Do not score the film out of 10; list problems and exact changes.
- A frame that reads as the wrong object is a P0 even if it is pretty.
- “Looks AI-generated” is a finding: name the tell (default dark void, glow, three cards, drifting
  title, tiny type) and replace it with a decision from the style pack.

## Completion criteria

- `qa/report.json` has zero errors.
- Every P0 is fixed; every P1 is fixed or explicitly accepted.
- The contact sheet and phone sheet have been reviewed.
- The fix list names the scene, time, problem and exact change.
