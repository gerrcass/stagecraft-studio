import { describe, expect, it } from "vitest";
import { theoHarnessPilot, theoHarnessTimings } from "../src/studio/pilot/theo-harness/pilot.js";
import { claimLedger } from "../src/studio/pilot/theo-harness/script.js";

describe("theo harness pilot", () => {
  it("has six scenes and a ~90 second runtime", () => {
    expect(theoHarnessPilot.scenes).toHaveLength(6);
    expect(theoHarnessTimings.total).toBeGreaterThan(88);
    expect(theoHarnessTimings.total).toBeLessThan(92);
  });

  it("every scene has narration and a claim id", () => {
    for (const scene of theoHarnessPilot.scenes) {
      expect(scene.narration.length).toBeGreaterThan(20);
      expect(scene.claimIds.length).toBeGreaterThan(0);
    }
  });

  it("every claim id in the pilot exists in the ledger", () => {
    const ids = new Set(claimLedger.map((claim) => claim.id));
    for (const scene of theoHarnessPilot.scenes) {
      for (const claimId of scene.claimIds) {
        expect(ids.has(claimId as (typeof claimLedger)[number]["id"])).toBe(true);
      }
    }
  });

  it("scenes do not overlap", () => {
    const ordered = [...theoHarnessPilot.scenes].sort((a, b) => a.start - b.start);
    for (let index = 1; index < ordered.length; index += 1) {
      const previous = ordered[index - 1]!;
      const current = ordered[index]!;
      expect(current.start).toBeGreaterThanOrEqual(previous.start + previous.duration - 0.001);
    }
  });
});
