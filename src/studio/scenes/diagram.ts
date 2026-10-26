import type { SceneIR } from "../ir.js";
import { enter, group, path, rect, text, type GroupLayer, type Layer } from "../layers.js";
import type { StylePack } from "../style/terminal-editorial.js";
import { bodyText, eyebrow, footer } from "./common.js";

type Node = {
  id: string;
  label: string;
  detail?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  accent?: boolean;
};

type Edge = {
  from: string;
  to: string;
  label?: string;
};

const defaultNodes: Node[] = [
  { id: "model", label: "LLM", detail: "TEXT ONLY", x: 120, y: 470, accent: false },
  { id: "harness", label: "HARNESS", detail: "PARSE / RUN / RETURN", x: 760, y: 470, accent: true },
  { id: "tools", label: "TOOLS", detail: "READ / EDIT / BASH", x: 1400, y: 470, accent: false },
];

const defaultEdges: Edge[] = [
  { from: "model", to: "harness", label: "TOOL CALL" },
  { from: "harness", to: "tools", label: "RUN" },
  { from: "tools", to: "model", label: "RESULT" },
];

const isNode = (value: unknown): value is Node => {
  if (typeof value !== "object" || value === null) return false;
  const node = value as Record<string, unknown>;
  return (
    typeof node.id === "string" &&
    typeof node.label === "string" &&
    typeof node.x === "number" &&
    typeof node.y === "number"
  );
};

const readNodes = (scene: SceneIR): Node[] => {
  const raw = scene.data?.nodes;
  return Array.isArray(raw) && raw.every(isNode) ? raw : defaultNodes;
};

const readEdges = (scene: SceneIR): Edge[] => {
  const raw = scene.data?.edges;
  if (!Array.isArray(raw)) return defaultEdges;
  return raw.filter((edge): edge is Edge => {
    if (typeof edge !== "object" || edge === null) return false;
    const candidate = edge as Record<string, unknown>;
    return typeof candidate.from === "string" && typeof candidate.to === "string";
  });
};

const center = (node: Node): { x: number; y: number; width: number; height: number } => {
  const width = node.width ?? 300;
  const height = node.height ?? 132;
  return { x: node.x + width / 2, y: node.y + height / 2, width, height };
};

const connector = (
  edge: Edge,
  byId: Map<string, Node>,
  style: StylePack,
  index: number,
): Layer | null => {
  const from = byId.get(edge.from);
  const to = byId.get(edge.to);
  if (!from || !to) return null;
  const a = center(from);
  const b = center(to);
  const startX = a.x + a.width / 2 - 8;
  const endX = b.x - b.width / 2 + 8;
  const midY = (a.y + b.y) / 2;
  const dip = index % 2 === 0 ? -58 : 58;
  const d = `M ${startX} ${a.y} C ${startX + 90} ${a.y + dip}, ${endX - 90} ${b.y + dip}, ${endX} ${b.y}`;
  const parts: Array<Layer | null> = [
      path({
        d,
        width: 1920,
        height: 1080,
        viewBox: "0 0 1920 1080",
        stroke: style.colors.line,
        strokeWidth: style.stroke.line,
        linecap: "round",
        draw: enter(0.55 + index * 0.12, 0.6),
      }),
      rect({
        x: endX - 7,
        y: b.y - 7,
        width: 14,
        height: 14,
        fill: style.colors.accent,
        radius: 7,
        opacity: enter(1.1 + index * 0.12, 0.25),
      }),
      edge.label
        ? text({
            x: Math.min(startX, endX) + Math.abs(endX - startX) / 2 - 90,
            y: midY + dip / 2 - 20,
            width: 180,
            align: "center",
            text: edge.label,
            font: style.fonts.mono,
            size: 12,
            color: style.colors.muted,
            letterSpacing: 2,
            opacity: enter(1.0 + index * 0.12, 0.3),
          })
        : null,
  ];

  return group({
    children: parts.filter((layer): layer is Layer => layer !== null),
  });
};

export const diagramScene = (scene: SceneIR, style: StylePack, index = 0): GroupLayer => {
  const nodes = readNodes(scene);
  const edges = readEdges(scene);
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const headlineReveal = enter(0.1, style.motion.enter);

  const nodeLayers: Layer[] = nodes.map((node, nodeIndex) => {
    const reveal = enter(0.35 + nodeIndex * 0.16, 0.4);
    const width = node.width ?? 300;
    const height = node.height ?? 132;
    return group({
      id: `${scene.id}-${node.id}`,
      x: node.x,
      y: (time) => node.y + 20 * (1 - reveal(time)),
      opacity: reveal,
      children: [
        rect({
          width,
          height,
          fill: node.accent ? style.colors.panel : "none",
          stroke: node.accent ? style.colors.accent : style.colors.line,
          strokeWidth: node.accent ? style.stroke.line : style.stroke.hair,
          radius: style.radii.small,
        }),
        text({
          x: 20,
          y: 24,
          text: node.label,
          font: style.fonts.display,
          size: 34,
          color: node.accent ? style.colors.text : style.colors.text,
          letterSpacing: "-0.02em",
        }),
        text({
          x: 20,
          y: 76,
          text: node.detail ?? "",
          font: style.fonts.mono,
          size: 12,
          color: node.accent ? style.colors.accent : style.colors.muted,
          letterSpacing: 2,
        }),
      ],
    });
  });

  const children: Layer[] = [
    eyebrow(scene, style),
    text({
      x: style.grid.margin,
      y: 196,
      width: 1500,
      text: scene.headline,
      font: style.fonts.display,
      size: style.type.displayMd,
      color: style.colors.text,
      lineHeight: 1.05,
      letterSpacing: "-0.04em",
      wrap: true,
      opacity: headlineReveal,
    }),
    ...connectorLayers(edges, byId, style),
    ...nodeLayers,
    footer(scene, style, index),
  ];

  const body = bodyText(scene, style, { y: 820, width: 900 });
  if (body) children.push(body);

  return group({ id: scene.id, children });
};

const connectorLayers = (
  edges: Edge[],
  byId: Map<string, Node>,
  style: StylePack,
): Layer[] =>
  edges
    .map((edge, index) => connector(edge, byId, style, index))
    .filter((layer): layer is Layer => layer !== null);
