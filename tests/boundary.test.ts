import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

describe("renderer boundary", () => {
  it("keeps the private engine out of src/studio", () => {
    const files = walk("src/studio").filter((file) => file.endsWith(".ts"));
    const offenders = files.filter((file) => /from ["']stagecraft["']/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
