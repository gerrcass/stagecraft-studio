import { describe, expect, it } from "vitest";
import { compilePilot, compileScene } from "../src/studio/compile.js";
import { parsePilot } from "../src/studio/ir.js";
import { terminalEditorial } from "../src/studio/style/terminal-editorial.js";

const pilot = parsePilot({
  id: "test-pilot",
  title: "Test pilot",
  size: { width: 1920, height: 1080 },
  fps: 30,
  duration: 10,
  stylePack: "terminal-editorial",
  scenes: [
    {
      id: "one",
      archetype: "title",
      start: 0,
      duration: 5,
      narration: "First line.",
      eyebrow: "TEST / ONE",
      headline: "From source to motion.",
      body: "A production layer for code-rendered explainers.",
      claimIds: ["C1"],
      transition: "fade",
    },
    {
      id: "two",
      archetype: "statement",
      start: 5,
      duration: 5,
      narration: "Second line.",
      eyebrow: "TEST / TWO",
      headline: "The renderer is the easy part.",
      body: "The studio is the grammar.",
      claimIds: ["C2"],
      transition: "cut",
    },
  ],
});

describe("compiler", () => {
  it("wraps each scene on the pilot clock", () => {
    const compiled = compilePilot(pilot, terminalEditorial);

    expect(compiled.duration).toBe(10);
    expect(compiled.root.type).toBe("group");
    expect(compiled.root.children).toHaveLength(2);
    expect(compiled.root.children[0]?.type).toBe("scene");
    expect(compiled.root.children[0]?.type === "scene" ? compiled.root.children[0].at : null).toBe(0);
    expect(compiled.root.children[1]?.type === "scene" ? compiled.root.children[1].at : null).toBe(5);
  });

  it("uses style tokens for the composition theme", () => {
    const compiled = compilePilot(pilot, terminalEditorial);

    expect(compiled.theme.colors.background).toBe(terminalEditorial.colors.background);
    expect(compiled.theme.colors.accent).toBe(terminalEditorial.colors.accent);
    expect(compiled.theme.fonts.display).toBe(terminalEditorial.fonts.display);
  });

  it("compiles a title scene with the headline and eyebrow", () => {
    const scene = compileScene(pilot.scenes[0]!, terminalEditorial, 0);
    const serialized = JSON.stringify(scene);

    expect(scene.id).toBe("one");
    expect(serialized).toContain("From source to motion.");
    expect(serialized).toContain("TEST / ONE");
  });

  it("compiles a statement scene with the accent rule", () => {
    const scene = compileScene(pilot.scenes[1]!, terminalEditorial, 1);

    expect(scene.id).toBe("two");
    expect(JSON.stringify(scene)).toContain("The renderer is the easy part.");
  });
});
