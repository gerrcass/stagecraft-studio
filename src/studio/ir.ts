import { z } from "zod";

export const ARCHETYPES = [
  "title",
  "statement",
  "diagram",
  "compare",
  "steps",
  "recap",
  "quote",
  "code",
] as const;

export type Archetype = (typeof ARCHETYPES)[number];

export const archetypeSchema = z.enum(ARCHETYPES);

export const transitionSchema = z.enum(["cut", "fade", "push"]);

export type Transition = z.infer<typeof transitionSchema>;

export const sceneSchema = z.object({
  id: z.string().min(1, "scene id is required"),
  archetype: archetypeSchema,
  start: z.number().min(0, "start must be at least 0"),
  duration: z.number().positive("duration must be positive"),
  narration: z.string().min(1, "narration is required"),
  eyebrow: z.string().optional(),
  headline: z.string().min(1, "headline is required"),
  body: z.string().optional(),
  claimIds: z.array(z.string().min(1)).default([]),
  data: z.record(z.string(), z.unknown()).optional(),
  transition: transitionSchema.default("fade"),
});

export type SceneIR = z.infer<typeof sceneSchema>;

export const sizeSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const pilotSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  size: sizeSchema,
  fps: z.number().int().min(1).max(120).default(30),
  duration: z.number().positive().optional(),
  stylePack: z.string().min(1),
  scenes: z.array(sceneSchema).min(1),
});

export type PilotIR = z.infer<typeof pilotSchema>;

export type ValidationIssue = {
  path: string;
  message: string;
};

export class StudioValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(context: string, issues: ValidationIssue[]) {
    super(`${context}: ${issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ")}`);
    this.name = "StudioValidationError";
    this.issues = issues;
  }
}

const toIssues = (error: z.ZodError): ValidationIssue[] =>
  error.issues.map((issue) => ({
    path: issue.path.length > 0 ? issue.path.join(".") : "(root)",
    message: issue.message,
  }));

/** Parse and validate a pilot. Throws StudioValidationError with every issue. */
export const parsePilot = (input: unknown): PilotIR => {
  const result = pilotSchema.safeParse(input);
  if (!result.success) {
    throw new StudioValidationError("Invalid pilot", toIssues(result.error));
  }

  const pilot = result.data;
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const scene of pilot.scenes) {
    if (seen.has(scene.id)) {
      issues.push({ path: scene.id, message: "duplicate scene id" });
    }
    seen.add(scene.id);
  }

  const ordered = [...pilot.scenes].sort((a, b) => a.start - b.start);
  let previousEnd = 0;
  for (const scene of ordered) {
    if (scene.start + 0.001 < previousEnd) {
      issues.push({
        path: scene.id,
        message: `scene starts at ${scene.start}s, before the previous scene ends at ${previousEnd}s`,
      });
    }
    previousEnd = Math.max(previousEnd, scene.start + scene.duration);
  }

  if (pilot.duration !== undefined) {
    const measured = ordered.reduce(
      (max, scene) => Math.max(max, scene.start + scene.duration),
      0,
    );
    if (Math.abs(pilot.duration - measured) > 0.05) {
      issues.push({
        path: "duration",
        message: `duration ${pilot.duration}s does not match the last scene end ${measured.toFixed(2)}s`,
      });
    }
  }

  if (issues.length > 0) {
    throw new StudioValidationError("Invalid pilot", issues);
  }

  return pilot;
};

/** Non-throwing validation for UI and tests. */
export const validatePilot = (
  input: unknown,
): { ok: true; pilot: PilotIR } | { ok: false; issues: ValidationIssue[] } => {
  try {
    return { ok: true, pilot: parsePilot(input) };
  } catch (error) {
    if (error instanceof StudioValidationError) {
      return { ok: false, issues: error.issues };
    }
    throw error;
  }
};

export const pilotDuration = (pilot: PilotIR): number =>
  pilot.scenes.reduce((max, scene) => Math.max(max, scene.start + scene.duration), 0);
