export type Box = { x: number; y: number; width: number; height: number };

export type QASeverity = "error" | "warning";

export type QAIssue = {
  code: string;
  severity: QASeverity;
  message: string;
  path?: string;
};

export type QAReport = {
  schemaVersion: 1;
  passed: boolean;
  issues: QAIssue[];
  counts: { error: number; warning: number };
};

const intersects = (a: Box, b: Box): number => {
  const left = Math.max(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  if (right <= left || bottom <= top) return 0;
  return (right - left) * (bottom - top);
};

export const checkBounds = (box: Box, canvas: Box, safe = 0.9): QAIssue[] => {
  const issues: QAIssue[] = [];
  const insetX = (canvas.width * (1 - safe)) / 2;
  const insetY = (canvas.height * (1 - safe)) / 2;
  const left = canvas.x + insetX;
  const top = canvas.y + insetY;
  const right = canvas.x + canvas.width - insetX;
  const bottom = canvas.y + canvas.height - insetY;

  if (box.x < left || box.y < top || box.x + box.width > right || box.y + box.height > bottom) {
    issues.push({
      code: "outside_safe_area",
      severity: "error",
      message: `Box ${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}×${Math.round(box.height)} is outside the ${Math.round(safe * 100)}% safe area.`,
    });
  }
  return issues;
};

export const checkOverflow = (input: {
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
}, tolerance = 3): QAIssue[] => {
  const issues: QAIssue[] = [];
  if (input.scrollWidth > input.clientWidth + tolerance) {
    issues.push({
      code: "overflow_x",
      severity: "error",
      message: `Text overflows horizontally by ${input.scrollWidth - input.clientWidth}px.`,
    });
  }
  if (input.scrollHeight > input.clientHeight + tolerance) {
    issues.push({
      code: "overflow_y",
      severity: "error",
      message: `Text overflows vertically by ${input.scrollHeight - input.clientHeight}px.`,
    });
  }
  return issues;
};

export const checkCollision = (a: Box, b: Box, minRatio = 0.18): QAIssue[] => {
  const overlap = intersects(a, b);
  if (overlap <= 0) return [];
  const smaller = Math.min(a.width * a.height, b.width * b.height);
  if (smaller <= 0) return [];
  const ratio = overlap / smaller;
  if (ratio < minRatio) return [];
  return [
    {
      code: "collision",
      severity: "error",
      message: `Boxes overlap by ${Math.round(ratio * 100)}% of the smaller box.`,
    },
  ];
};

export const checkTypeFloor = (size: number, floor = 14): QAIssue[] => {
  if (size >= floor) return [];
  return [
    {
      code: "type_below_floor",
      severity: "error",
      message: `Type is ${size}px, below the ${floor}px floor.`,
    },
  ];
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(normalized)) return null;
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
};

const channel = (value: number): number => {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

export const relativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`Not a hex color: ${hex}`);
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
};

export const contrastRatio = (foreground: string, background: string): number => {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
};

export const checkContrast = (
  foreground: string,
  background: string,
  min = 3,
): QAIssue[] => {
  const ratio = contrastRatio(foreground, background);
  if (ratio >= min) return [];
  return [
    {
      code: "low_contrast",
      severity: "error",
      message: `Contrast is ${ratio.toFixed(2)}:1, below ${min}:1.`,
    },
  ];
};

export const summarize = (issues: QAIssue[]): QAReport => {
  const error = issues.filter((issue) => issue.severity === "error").length;
  const warning = issues.filter((issue) => issue.severity === "warning").length;
  return {
    schemaVersion: 1,
    passed: error === 0,
    issues,
    counts: { error, warning },
  };
};
