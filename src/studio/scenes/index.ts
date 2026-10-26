import type { Archetype } from "../ir.js";
import type { SceneIR } from "../ir.js";
import type { GroupLayer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { statementScene } from "./statement.js";
import { titleScene } from "./title.js";

export type SceneBuilder = (scene: SceneIR, style: StylePack, index: number) => GroupLayer;

/** v0 builders. The remaining archetypes are filled in ticket #3. */
export const sceneBuilders: Record<Archetype, SceneBuilder> = {
  title: titleScene,
  statement: statementScene,
  diagram: statementScene,
  compare: statementScene,
  steps: statementScene,
  recap: statementScene,
  quote: statementScene,
  code: statementScene,
};
