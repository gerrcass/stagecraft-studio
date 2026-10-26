/** Renderer-neutral layer tree. Mirrors the Stagecraft layer shape without importing it. */

export type Motion<T> = T | ((time: number) => T);

export type Origin =
  | "center"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right"
  | { x: number; y: number };

export type LayerBase = {
  id?: string;
  x?: Motion<number>;
  y?: Motion<number>;
  width?: Motion<number>;
  height?: Motion<number>;
  scale?: Motion<number>;
  scaleX?: Motion<number>;
  scaleY?: Motion<number>;
  rotate?: Motion<number>;
  opacity?: Motion<number>;
  origin?: Motion<Origin>;
  z?: Motion<number>;
  className?: string;
  style?: Record<string, Motion<string | number>>;
  visible?: Motion<boolean>;
};

export type GroupLayer = LayerBase & {
  type: "group";
  children: Layer[];
};

export type SceneLayer = LayerBase & {
  type: "scene";
  at?: Motion<number>;
  children: Layer[];
};

export type TextLayer = LayerBase & {
  type: "text";
  text: Motion<string>;
  font?: Motion<string>;
  size?: Motion<number>;
  weight?: Motion<string | number>;
  color?: Motion<string>;
  lineHeight?: Motion<number>;
  letterSpacing?: Motion<number | string>;
  align?: Motion<"left" | "center" | "right">;
  wrap?: boolean;
};

export type RectLayer = LayerBase & {
  type: "rect";
  fill?: Motion<string>;
  radius?: Motion<number>;
  stroke?: Motion<string>;
  strokeWidth?: Motion<number>;
};

export type PathLayer = LayerBase & {
  type: "path";
  d: Motion<string>;
  viewBox?: string;
  fill?: Motion<string>;
  stroke?: Motion<string>;
  strokeWidth?: Motion<number>;
  draw?: Motion<number>;
  linecap?: "butt" | "round" | "square";
  linejoin?: "miter" | "round" | "bevel";
};

export type Layer = GroupLayer | SceneLayer | TextLayer | RectLayer | PathLayer;

export type GroupProps = Omit<GroupLayer, "type" | "children"> & { children?: Layer[] };
export type SceneProps = Omit<SceneLayer, "type" | "children"> & { children?: Layer[] };
export type TextProps = Omit<TextLayer, "type" | "text"> & { text: Motion<string> };
export type RectProps = Omit<RectLayer, "type">;
export type PathProps = Omit<PathLayer, "type" | "d"> & { d: Motion<string> };

export const group = (props: GroupProps = {}): GroupLayer => ({
  type: "group",
  children: props.children ?? [],
  ...props,
});

export const scene = (props: SceneProps = {}): SceneLayer => ({
  type: "scene",
  children: props.children ?? [],
  ...props,
});

export const text = (props: TextProps): TextLayer => ({ type: "text", ...props });

export const rect = (props: RectProps = {}): RectLayer => ({ type: "rect", ...props });

export const path = (props: PathProps): PathLayer => ({ type: "path", ...props });

export const line = (props: RectProps = {}): RectLayer => rect(props);

export const circle = (props: RectProps = {}): RectLayer =>
  rect({ radius: 999, ...props });

/** Clamped progress from 0 to 1. */
export const progress = (time: number, start: number, end: number): number => {
  if (time <= start) return 0;
  if (time >= end) return 1;
  return (time - start) / (end - start);
};

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const outCubic = (p: number): number => 1 - Math.pow(1 - clamp01(p), 3);
const inOutCubic = (p: number): number => {
  const value = clamp01(p);
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
};

/** A pure entrance motion used by the archetypes. */
export const enter = (
  start = 0,
  duration = 0.5,
  ease: "out" | "inOut" = "out",
): ((time: number) => number) => {
  const easeFn = ease === "out" ? outCubic : inOutCubic;
  return (time: number) => easeFn(progress(time, start, start + duration));
};
