import { describe, expect, it } from "vitest";
import {
  checkBounds,
  checkCollision,
  checkContrast,
  checkOverflow,
  checkTypeFloor,
  contrastRatio,
  summarize,
} from "../src/studio/qa/checks.js";

describe("QA checks", () => {
  it("flags text outside the safe area and passes a clean box", () => {
    const canvas = { x: 0, y: 0, width: 1920, height: 1080 };
    expect(checkBounds({ x: 100, y: 100, width: 400, height: 80 }, canvas)).toHaveLength(0);
    const issues = checkBounds({ x: 10, y: 10, width: 400, height: 80 }, canvas);
    expect(issues[0]?.code).toBe("outside_safe_area");
  });

  it("flags overflow and passes exact fit", () => {
    expect(
      checkOverflow({ scrollWidth: 400, clientWidth: 400, scrollHeight: 80, clientHeight: 80 }),
    ).toHaveLength(0);
    expect(
      checkOverflow({ scrollWidth: 410, clientWidth: 400, scrollHeight: 80, clientHeight: 80 })[0]
        ?.code,
    ).toBe("overflow_x");
  });

  it("flags a collision only above the threshold", () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    expect(checkCollision(a, { x: 90, y: 0, width: 100, height: 100 })).toHaveLength(0);
    expect(checkCollision(a, { x: 20, y: 0, width: 100, height: 100 })[0]?.code).toBe("collision");
  });

  it("enforces a type floor", () => {
    expect(checkTypeFloor(30)).toHaveLength(0);
    expect(checkTypeFloor(12)[0]?.code).toBe("type_below_floor");
  });

  it("computes contrast and flags a low pair", () => {
    expect(contrastRatio("#F2F2F2", "#0A0A0A")).toBeGreaterThan(15);
    expect(checkContrast("#3B3B3B", "#0A0A0A")[0]?.code).toBe("low_contrast");
    expect(checkContrast("#F2F2F2", "#0A0A0A")).toHaveLength(0);
  });

  it("summarizes errors and warnings", () => {
    const report = summarize([
      { code: "a", severity: "error", message: "A" },
      { code: "b", severity: "warning", message: "B" },
    ]);
    expect(report.passed).toBe(false);
    expect(report.counts).toEqual({ error: 1, warning: 1 });
  });
});
