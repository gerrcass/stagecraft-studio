import { describe, expect, it } from "vitest";
import { ARCHETYPES, type Archetype } from "../src/studio/ir.js";
import { compileScene } from "../src/studio/compile.js";
import { terminalEditorial } from "../src/studio/style/terminal-editorial.js";

const base = {
  id: "scene",
  start: 0,
  duration: 8,
  narration: "Narration.",
  eyebrow: "TEST / SCENE",
  headline: "The renderer is the easy part.",
  body: "The studio is the grammar.",
  claimIds: ["C1"],
  transition: "fade" as const,
};

describe("archetypes", () => {
  for (const archetype of ARCHETYPES) {
    it(`compiles ${archetype}`, () => {
      const scene = compileScene(
        { ...base, archetype: archetype as Archetype },
        terminalEditorial,
        0,
      );
      const serialized = JSON.stringify(scene);

      expect(scene.type).toBe("group");
      expect(scene.id).toBe("scene");
      expect(serialized).toContain("The renderer is the easy part.");
      expect(serialized.length).toBeGreaterThan(200);
    });
  }

  it("uses diagram data when supplied", () => {
    const scene = compileScene(
      {
        ...base,
        archetype: "diagram",
        data: {
          nodes: [
            { id: "a", label: "SOURCE", x: 120, y: 470 },
            { id: "b", label: "STUDIO", x: 760, y: 470, accent: true },
          ],
          edges: [{ from: "a", to: "b", label: "TRANSFORM" }],
        },
      },
      terminalEditorial,
      0,
    );
    const serialized = JSON.stringify(scene);

    expect(serialized).toContain("SOURCE");
    expect(serialized).toContain("STUDIO");
    expect(serialized).toContain("TRANSFORM");
  });
});
