import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright-core";
import {
  checkBounds,
  checkCollision,
  checkContrast,
  checkOverflow,
  checkTypeFloor,
  summarize,
  type QAIssue,
} from "../src/studio/qa/checks.js";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const get = (flag: string, fallback: string): string => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1]! : fallback;
};

const html = resolve(root, get("--html", "tmp/qa/theo-harness.html"));
const outDir = resolve(root, get("--out", "qa"));
const manifestPath = resolve(root, get("--manifest", "public/demo/manifest.json"));

if (!existsSync(html)) {
  throw new Error(
    `No exported HTML at ${html}. Export it first:\n  node <stagecraft>/dist/cli.js export src/pilot/theo-harness/composition.ts --format html --out ${html}`,
  );
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  width: number;
  height: number;
  scenes: Array<{ id: string; label: string; start: number; duration: number }>;
};

const executablePath = [
  process.env.CHROME,
  process.env.STAGECRAFT_CHROME,
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/snap/bin/chromium",
].find((candidate): candidate is string => Boolean(candidate && existsSync(candidate)));

if (!executablePath) {
  throw new Error("No Chromium found. Set CHROME to a Chromium/Chrome binary.");
}

mkdirSync(join(outDir, "stills"), { recursive: true });

const browser = await chromium.launch({
  executablePath,
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage({
  viewport: { width: manifest.width, height: manifest.height },
  deviceScaleFactor: 1,
});

await page.goto(`file://${html}`);
await page.waitForFunction(() => Boolean((window as unknown as { stagecraft?: { isReady?: boolean } }).stagecraft?.isReady), undefined, {
  timeout: 30_000,
});

type TextNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
  fixedHeight: boolean;
  fontSize: number;
  color: string;
  opacity: number;
};

const issues: QAIssue[] = [];
const reportScenes: Array<{ id: string; time: number; screenshot: string }> = [];

for (const scene of manifest.scenes) {
  const time = scene.start + scene.duration / 2;
  await page.evaluate((t) => {
    (window as unknown as { stagecraft: { render: (value: number) => void } }).stagecraft.render(t);
  }, time);
  await page.waitForTimeout(120);

  const screenshot = join(outDir, "stills", `${scene.id}.png`);
  await page.screenshot({ path: screenshot });
  reportScenes.push({ id: scene.id, time, screenshot });

  const data = await page.evaluate(() => {
    const stage = document.querySelector(".sc-stage");
    if (!stage) return null;
    const stageRect = stage.getBoundingClientRect();
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-sc-type="text"]'))
      .filter((element) => {
        const check = (
          element as HTMLElement & {
            checkVisibility?: (options?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean }) => boolean;
          }
        ).checkVisibility;
        return check ? check.call(element, { checkOpacity: true, checkVisibilityCSS: true }) : true;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          id: element.dataset.scId ?? element.textContent?.trim().slice(0, 24) ?? "text",
          text: element.textContent ?? "",
          x: rect.x - stageRect.x,
          y: rect.y - stageRect.y,
          width: rect.width,
          height: rect.height,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
          fixedHeight: element.style.height !== "" && element.style.height !== "auto",
          fontSize: Number.parseFloat(style.fontSize),
          color: style.color,
          opacity: Number.parseFloat(style.opacity),
        };
      })
      .filter((node) => node.width > 0 && node.height > 0);
    return {
      stage: { x: 0, y: 0, width: stageRect.width, height: stageRect.height },
      nodes,
    };
  });

  if (!data) {
    issues.push({
      code: "missing_stage",
      severity: "error",
      message: `No .sc-stage found for ${scene.id}`,
      path: scene.id,
    });
    continue;
  }

  const boxes = data.nodes
    .filter((node) => node.text.trim().length > 0 && node.width > 0 && node.height > 0)
    .map((node) => ({
      node,
      box: { x: node.x, y: node.y, width: node.width, height: node.height },
    }));

  for (const { node, box } of boxes) {
    for (const issue of checkBounds(box, data.stage, 0.9)) {
      issues.push({ ...issue, path: `${scene.id}/${node.id}` });
    }
    for (const issue of checkOverflow({
      ...node,
      scrollHeight: node.fixedHeight ? node.scrollHeight : node.clientHeight,
    })) {
      issues.push({ ...issue, path: `${scene.id}/${node.id}` });
    }
    for (const issue of checkTypeFloor(node.fontSize, 14)) {
      issues.push({ ...issue, path: `${scene.id}/${node.id}` });
    }
    if (node.fontSize < 28 && node.text.trim().length > 30) {
      issues.push({
        code: "type_below_read",
        severity: "warning",
        message: `Reading text is ${node.fontSize}px; the style pack recommends 28px+.`,
        path: `${scene.id}/${node.id}`,
      });
    }
    if (node.opacity >= 0.5 && node.color !== "rgb(59, 59, 59)") {
      const hex = (() => {
        const match = node.color.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (!match) return null;
        return `#${[match[1], match[2], match[3]]
          .map((value) => Number(value).toString(16).padStart(2, "0"))
          .join("")}`;
      })();
      if (hex) {
        for (const issue of checkContrast(hex, "#0A0A0A", 3)) {
          issues.push({ ...issue, path: `${scene.id}/${node.id}` });
        }
      }
    }
  }

  const focus = boxes.filter(({ node }) => node.fontSize >= 24);
  for (let i = 0; i < focus.length; i += 1) {
    for (let j = i + 1; j < focus.length; j += 1) {
      for (const issue of checkCollision(focus[i]!.box, focus[j]!.box)) {
        issues.push({
          ...issue,
          path: `${scene.id}/${focus[i]!.node.id}+${focus[j]!.node.id}`,
        });
      }
    }
  }
}

await browser.close();

const report = {
  ...summarize(issues),
  generatedBy: "stagecraft-studio",
  html,
  scenes: reportScenes,
};
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log(
  `QA ${report.passed ? "passed" : "failed"}: ${report.counts.error} errors, ${report.counts.warning} warnings → ${join(outDir, "report.json")}`,
);
if (!report.passed) {
  process.exitCode = 1;
}
