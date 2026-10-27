import type { CompiledComposition } from "../compile.js";

/**
 * The Stagecraft boundary. It is deliberately a plain object: the studio emits a
 * renderer-neutral composition, and the Stagecraft entry point consumes it via
 * `defineComposition`. The private engine is imported only by the pilot entry.
 */
export type StagecraftCompositionInput = CompiledComposition;

export const toStagecraftComposition = (
  compiled: CompiledComposition,
): StagecraftCompositionInput => compiled;
