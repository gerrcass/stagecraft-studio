import type { Archetype, SceneIR } from "../ir.js";
import type { GroupLayer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { codeScene } from "./code.js";
import { compareScene } from "./compare.js";
import { diagramScene } from "./diagram.js";
import { quoteScene } from "./quote.js";
import { recapScene } from "./recap.js";
import { statementScene } from "./statement.js";
import { stepsScene } from "./steps.js";
import { titleScene } from "./title.js";

export type SceneBuilder = (scene: SceneIR, style: StylePack, index: number) => GroupLayer;

export const sceneBuilders: Record<Archetype, SceneBuilder> = {
  title: titleScene,
  statement: statementScene,
  diagram: diagramScene,
  compare: compareScene,
  steps: stepsScene,
  recap: recapScene,
  quote: quoteScene,
  code: codeScene,
};
