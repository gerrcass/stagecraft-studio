/** The terminal-editorial style pack: the only source of visual constants. */

export type StylePack = {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    muted: string;
    accent: string;
    success: string;
    line: string;
    panel: string;
  };
  fonts: {
    display: string;
    mono: string;
  };
  type: {
    displayXl: number;
    displayLg: number;
    displayMd: number;
    displaySm: number;
    number: number;
    diagramLabel: number;
    recapLabel: number;
    quote: number;
    code: number;
    bodyLg: number;
    body: number;
    label: number;
    micro: number;
  };
  grid: {
    width: number;
    height: number;
    columns: number;
    margin: number;
    gutter: number;
  };
  safe: {
    action: number;
    title: number;
  };
  radii: {
    small: number;
    medium: number;
  };
  stroke: {
    hair: number;
    line: number;
    bold: number;
  };
  motion: {
    enter: number;
    exit: number;
    hero: number;
    hold: number;
    stagger: number;
    fade: number;
    push: number;
  };
  limits: {
    headlineChars: number;
    bodyChars: number;
    eyebrowChars: number;
  };
};

export const terminalEditorial: StylePack = {
  id: "terminal-editorial",
  name: "Terminal Editorial",
  colors: {
    background: "#0A0A0A",
    text: "#F2F2F2",
    muted: "#8E8E8E",
    accent: "#FF5100",
    success: "#00D178",
    line: "#3B3B3B",
    panel: "#141414",
  },
  fonts: {
    display: '"TeX Gyre Heros", "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  type: {
    displayXl: 152,
    displayLg: 108,
    displayMd: 76,
    displaySm: 42,
    number: 96,
    diagramLabel: 34,
    recapLabel: 64,
    quote: 260,
    code: 20,
    bodyLg: 38,
    body: 30,
    label: 20,
    micro: 15,
  },
  grid: {
    width: 1920,
    height: 1080,
    columns: 12,
    margin: 120,
    gutter: 24,
  },
  safe: {
    action: 0.9,
    title: 0.8,
  },
  radii: {
    small: 4,
    medium: 10,
  },
  stroke: {
    hair: 1,
    line: 2,
    bold: 4,
  },
  motion: {
    enter: 0.5,
    exit: 0.35,
    hero: 0.7,
    hold: 1.2,
    stagger: 0.08,
    fade: 0.18,
    push: 28,
  },
  limits: {
    headlineChars: 42,
    bodyChars: 90,
    eyebrowChars: 32,
  },
};

export const stylePacks: Record<string, StylePack> = {
  [terminalEditorial.id]: terminalEditorial,
};

export const getStylePack = (id: string): StylePack => {
  const pack = stylePacks[id];
  if (!pack) {
    throw new Error(`Unknown style pack "${id}". Available: ${Object.keys(stylePacks).join(", ")}`);
  }
  return pack;
};
