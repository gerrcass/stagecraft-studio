# Stagecraft Studio

A production layer around Stagecraft for turning a source article into a code-rendered educational
motion-graphics video. The language below is the shared vocabulary for the studio, the pilot and the
agent instructions.

## Language

**Studio**:
The production layer that turns a source into a script, scene IR, composition, audio, captions, QA
evidence and a handoff. It is not the renderer.
_Avoid_: App, platform, editor

**Source**:
The article, paper or notes a video teaches from. A source has claims, not scenes.
_Avoid_: Input, content

**Claim ledger**:
The numbered claims, quotes, numbers and citations extracted from a source and referenced by scenes.
_Avoid_: Research, notes

**Brief**:
The one-page definition of audience, takeaway, duration, style pack, voice and constraints.
_Avoid_: Plan, treatment

**Script**:
The narration, written voice-first in beats, with a target word budget.
_Avoid_: Copy, voiceover text

**Beat**:
A named moment in the script with a start, end, narration, visual intent and claim IDs.
_Avoid_: Scene, shot

**Scene IR**:
The typed intermediate representation of a scene: archetype, narration, on-screen text, data,
citations, duration and transition. The compiler turns it into renderer layers.
_Avoid_: Storyboard, JSON

**Scene**:
One rendered unit of the composition, built from a scene archetype and resolved against a clock.
_Avoid_: Slide, clip

**Style pack**:
A versioned folder of design tokens, motion grammar, layouts, reference frames, anti-patterns and
style-specific components.
_Avoid_: Theme, template

**Renderer adapter**:
The boundary that converts studio scene IR into a specific renderer's layers. Stagecraft is the
primary adapter.
_Avoid_: Engine, backend

**Plate**:
A deterministic, frame-exact render of a scene or composition, ready for assembly in ffmpeg or an
NLE.
_Avoid_: Clip, export

**Handoff**:
The Resolve/ffmpeg-ready bundle: plates, stems, captions, cut list, markers and manifest.
_Avoid_: Export, package

**QA gate**:
A checkable condition a scene or master must pass before moving on. Deterministic gates run before
human or vision review.
_Avoid_: Review, check

**Pilot**:
The 90-second Theo “harness” piece that proves the studio grammar end to end.
_Avoid_: Demo, sample

**Model policy**:
The rule that this build uses only `opencode-go/deepseek-v4.1-flash#max`.
_Avoid_: Preference, default model
