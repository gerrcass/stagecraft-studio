import type { Archetype } from "../../ir.js";

export type SceneSeed = {
  id: string;
  archetype: Archetype;
  eyebrow: string;
  headline: string;
  body: string;
  narration: string;
  claimIds: string[];
  transition: "cut" | "fade" | "push";
  hold: number;
  data?: Record<string, unknown>;
};

/** Voice-first pilot script. One idea per scene, six scenes, about 180 words. */
export const sceneSeeds: SceneSeed[] = [
  {
    id: "01-cold-open",
    archetype: "title",
    eyebrow: "THE HARNESS / 01",
    headline: "An LLM can write code.",
    body: "It still can’t click a button.",
    narration:
      "An LLM can write code. It still can't click a button. The model is a text engine. It has no hands. By default, all it can do is generate text.",
    claimIds: ["C1"],
    transition: "fade",
    hold: 1.2,
  },
  {
    id: "02-interfaces",
    archetype: "statement",
    eyebrow: "HUMANS / 02",
    headline: "Humans use interfaces.",
    body: "A terminal, a website, an app. The interface hides the code underneath.",
    narration:
      "Generally, humans don't use computers by writing code. We use an interface: a terminal, a website, an app. The interface is the part you can see and touch. It hides the code underneath.",
    claimIds: ["C2"],
    transition: "fade",
    hold: 1.2,
    data: {
      chips: ["TERMINAL", "WEBSITE", "APP"],
    },
  },
  {
    id: "03-harness-loop",
    archetype: "diagram",
    eyebrow: "LLMS / 03",
    headline: "The model only sends text.",
    body: "A tool call is text. Something has to parse it, run it, and return the result.",
    narration:
      "An LLM needs tools. It emits a tool call as text. Something has to parse that text, run the tool, and send the result back. The model never runs the tool itself. The harness does. That loop is the harness.",
    claimIds: ["C3"],
    transition: "fade",
    hold: 1.2,
    data: {
      nodes: [
        { id: "model", label: "LLM", detail: "TEXT ONLY", x: 120, y: 470 },
        { id: "harness", label: "HARNESS", detail: "PARSE / RUN / RETURN", x: 760, y: 470, accent: true },
        { id: "tools", label: "TOOLS", detail: "READ / EDIT / BASH", x: 1400, y: 470 },
      ],
      edges: [
        { from: "model", to: "harness", label: "TOOL CALL" },
        { from: "harness", to: "tools", label: "RUN" },
        { from: "tools", to: "model", label: "RESULT" },
      ],
    },
  },
  {
    id: "04-five-parts",
    archetype: "steps",
    eyebrow: "DEFINITION / 04",
    headline: "A harness is five things.",
    body: "",
    narration:
      "A harness is five things: the tools, the syntax for calling them, a parser, a result channel, and a list of what's available. Miss one and the loop breaks.",
    claimIds: ["C4"],
    transition: "fade",
    hold: 1.2,
    data: {
      steps: [
        { label: "TOOLS", body: "read_file, edit_file, bash, search" },
        { label: "SYNTAX", body: "A text format the model can emit" },
        { label: "PARSER", body: "Reads the message and runs the code" },
        { label: "RESULT", body: "The output goes back into the model" },
        { label: "TOOL LIST", body: "What the model is allowed to call" },
      ],
    },
  },
  {
    id: "05-claude-code",
    archetype: "compare",
    eyebrow: "CLAUDE CODE / 05",
    headline: "Claude Code is kind of a harness.",
    body: "It bakes the interface and the harness into one app. The kitchen: pots and pans, and a harness that lets you bring your own.",
    narration:
      "Claude Code is kind of a harness. It bakes the interface and the harness into one app. The interface is for you. The harness is for the model. Think of a kitchen: the tools are pots and pans, and a good harness lets you bring your own.",
    claimIds: ["C5"],
    transition: "fade",
    hold: 1.2,
    data: {
      left: {
        label: "INTERFACE",
        headline: "What the human sees.",
        body: "A terminal, a website, an app.",
      },
      right: {
        label: "HARNESS",
        headline: "What the model sees.",
        body: "Tools, syntax, a parser, results, a list.",
        accent: true,
      },
    },
  },
  {
    id: "06-recap",
    archetype: "recap",
    eyebrow: "RECAP / 06",
    headline: "An agent is an LLM plus a harness.",
    body: "The model is the chef. The harness is the kitchen. T3 Code is the restaurant that lets you bring whatever kitchen you want.",
    narration:
      "An agent is an LLM plus a harness. The model is the chef. The harness is the kitchen. And T3 Code is the restaurant that lets you bring whatever kitchen you want. That is the whole trick.",
    claimIds: ["C6"],
    transition: "fade",
    hold: 1.4,
  },
];

/** Human-readable claim ledger for the pilot. */
export const claimLedger = [
  {
    id: "C1",
    claim: "By default, an LLM generates text and cannot click a button.",
    source: "Theo t3.gg, “What is a harness?”, 23 Oct 2026",
  },
  {
    id: "C2",
    claim: "Generally, humans use interfaces such as terminals, websites and apps; the code underneath is hidden.",
    source: "Theo t3.gg, “What is a harness?”, 23 Oct 2026",
  },
  {
    id: "C3",
    claim: "The model emits a text tool call; a harness parses it, runs the tool and returns the result.",
    source: "Theo t3.gg, “What is a harness?”, 23 Oct 2026",
  },
  {
    id: "C4",
    claim: "A harness is tools, a calling syntax, a parser, a result channel and a tool list.",
    source: "Theo t3.gg, “What is a harness?”, 23 Oct 2026",
  },
  {
    id: "C5",
    claim: "Claude Code is kind of a harness; the kitchen metaphor describes bring-your-own tools.",
    source: "Theo t3.gg, “What is a harness?”, 23 Oct 2026",
  },
  {
    id: "C6",
    claim: "An agent is an LLM plus a harness; T3 Code is the restaurant, not the kitchen.",
    source: "Theo t3.gg, “What is a harness?”, 23 Oct 2026",
  },
] as const;
