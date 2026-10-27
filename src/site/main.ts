import "./style.css";

type Still = { src: string; label: string; time?: number };

type Manifest = {
  title: string;
  subtitle?: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
  video: string;
  poster: string;
  contactSheet?: string;
  captions?: string;
  vtt?: string;
  stills: Still[];
  scenes: Array<{ id: string; label: string; start: number; duration: number }>;
};

const base = import.meta.env.BASE_URL;

const fallback: Manifest = {
  title: "What is a harness?",
  subtitle: "A 90-second explainer adapted from Theo t3.gg’s article.",
  duration: 90,
  width: 1920,
  height: 1080,
  fps: 30,
  video: `${base}demo/theo-harness.mp4`,
  poster: `${base}demo/poster.png`,
  contactSheet: `${base}demo/contact-sheet.png`,
  captions: `${base}demo/theo-harness.srt`,
  vtt: `${base}demo/theo-harness.vtt`,
  stills: [],
  scenes: [],
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");

const loadManifest = async (): Promise<Manifest> => {
  try {
    const response = await fetch(`${base}demo/manifest.json`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const data = (await response.json()) as Partial<Manifest>;
    return { ...fallback, ...data, stills: data.stills ?? [], scenes: data.scenes ?? [] };
  } catch {
    return fallback;
  }
};

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const link = (href: string, label: string, className = "button"): HTMLAnchorElement => {
  const anchor = el("a", className, label);
  anchor.href = href;
  anchor.rel = "noreferrer";
  return anchor;
};

const timecode = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const render = (manifest: Manifest): void => {
  const nav = el("header", "nav");
  const brand = el("a", "brand");
  brand.href = "#top";
  brand.innerHTML = `<span class="brand-mark"></span><span>STAGECRAFT STUDIO</span>`;
  const navLinks = el("div", "nav-links");
  navLinks.append(
    link("#demo", "PILOT", "nav-link"),
    link("#pipeline", "PIPELINE", "nav-link"),
    link("#skills", "SKILLS", "nav-link"),
    link("#docs", "DOCS", "nav-link"),
    link("https://github.com/gerrcass/stagecraft-studio", "GITHUB ↗", "nav-link"),
  );
  nav.append(brand, navLinks);

  const hero = el("section", "hero");
  hero.id = "top";
  const heroCopy = el("div", "hero-copy");
  const eyebrow = el("p", "eyebrow");
  eyebrow.innerHTML = `<span class="square"></span> v0 / TERMINAL EDITORIAL`;
  const h1 = el("h1", "display");
  h1.innerHTML = "From source<br /><em>to motion.</em>";
  const lede = el(
    "p",
    "lede",
    "A production layer for turning an article into a code-rendered explainer: a typed scene IR, a design system, deterministic QA and a clean handoff.",
  );
  const actions = el("div", "actions");
  actions.append(
    link("#demo", "WATCH THE PILOT", "button primary"),
    link("https://github.com/gerrcass/stagecraft-studio", "READ THE CODE ↗", "button ghost"),
  );
  const meta = el("div", "meta-row");
  meta.innerHTML = `
    <div><span class="meta-key">RUNTIME</span><span class="meta-value">${timecode(manifest.duration)}</span></div>
    <div><span class="meta-key">CANVAS</span><span class="meta-value">${manifest.width}×${manifest.height}</span></div>
    <div><span class="meta-key">FPS</span><span class="meta-value">${manifest.fps}</span></div>
    <div><span class="meta-key">ENGINE</span><span class="meta-value">STAGECRAFT</span></div>
  `;
  heroCopy.append(eyebrow, h1, lede, actions, meta);

  const heroVisual = el("div", "hero-visual");
  const poster = el("img", "hero-poster") as HTMLImageElement;
  poster.src = manifest.poster;
  poster.alt = "Poster frame from the harness pilot";
  const posterLabel = el("div", "poster-label");
  posterLabel.innerHTML = `<span>PILOT / 01</span><span>${Math.round(manifest.duration)}s</span>`;
  heroVisual.append(poster, posterLabel);
  hero.append(heroCopy, heroVisual);

  const demo = el("section", "section demo");
  demo.id = "demo";
  const demoHead = el("div", "section-head");
  demoHead.innerHTML = `
    <p class="eyebrow"><span class="square"></span> THE PILOT</p>
    <h2>What is a harness?</h2>
    <p class="section-lede">Six scenes, one idea: an LLM only emits text; a harness turns it into action. Adapted from Theo t3.gg’s article.</p>
  `;
  const videoWrap = el("div", "video-wrap");
  const video = el("video", "video") as HTMLVideoElement;
  video.controls = true;
  video.preload = "metadata";
  video.poster = manifest.poster;
  video.src = manifest.video;
  video.setAttribute("playsinline", "");
  video.setAttribute("aria-label", "What is a harness? — 90-second explainer");
  if (manifest.vtt) {
    const track = el("track");
    track.kind = "captions";
    track.label = "English";
    track.srclang = "en";
    track.src = manifest.vtt;
    track.default = true;
    video.append(track);
  }
  videoWrap.append(video);
  const demoFoot = el("div", "demo-foot");
  demoFoot.innerHTML = `
    <span>${manifest.stills.length} STILLS / ${manifest.scenes.length} SCENES</span>
    <span><a href="${manifest.captions ?? "#"}" download>CAPTIONS .SRT</a> · <a href="${manifest.vtt ?? "#"}" target="_blank" rel="noreferrer">.VTT</a> · <a href="${manifest.contactSheet ?? "#"}" target="_blank" rel="noreferrer">CONTACT SHEET ↗</a></span>
  `;
  demo.append(demoHead, videoWrap, demoFoot);

  const strip = el("section", "strip");
  if (manifest.stills.length > 0) {
    for (const still of manifest.stills) {
      const figure = el("figure", "still");
      const img = el("img") as HTMLImageElement;
      img.src = still.src;
      img.alt = still.label;
      img.loading = "lazy";
      const caption = el("figcaption", "still-label", still.label);
      figure.append(img, caption);
      strip.append(figure);
    }
  } else {
    strip.innerHTML = `<div class="empty">Demo stills will appear here after the pilot render.</div>`;
  }

  const pipeline = el("section", "section pipeline");
  pipeline.id = "pipeline";
  const pipelineHead = el("div", "section-head");
  pipelineHead.innerHTML = `
    <p class="eyebrow"><span class="square"></span> THE GRAMMAR</p>
    <h2>Source in. Scene IR out.</h2>
    <p class="section-lede">The renderer is the easy part. The studio is the set of decisions that keeps sixty scenes looking like one film.</p>
  `;
  const steps = [
    ["01", "RESEARCH", "Claims, quotes and numbers with source IDs."],
    ["02", "DIRECT", "A one-sentence takeaway, a voice-first script, one idea per scene."],
    ["03", "DESIGN", "A style pack, a scene archetype, a reason for every move."],
    ["04", "RENDER", "Deterministic plates from Stagecraft; stills before motion."],
    ["05", "FINISH", "QA, voice, captions, loudness, handoff, package."],
  ];
  const pipelineGrid = el("div", "pipeline-grid");
  for (const [n, title, body] of steps) {
    const card = el("article", "pipeline-card");
    card.innerHTML = `<span class="card-number">${n}</span><h3>${title}</h3><p>${body}</p>`;
    pipelineGrid.append(card);
  }
  pipeline.append(pipelineHead, pipelineGrid);

  const skills = el("section", "section skills");
  skills.id = "skills";
  const skillsHead = el("div", "section-head");
  skillsHead.innerHTML = `
    <p class="eyebrow"><span class="square"></span> THE STUDIO</p>
    <h2>Seven skills. Four agents.</h2>
    <p class="section-lede">The agent gets the contract, the design system, the QA gates and the handoff — not a blank prompt.</p>
  `;
  const skillList = [
    ["studio", "The contract, commands and artifact flow."],
    ["explainer-director", "Source → claims → brief → script → beats."],
    ["stagecraft-design", "Style pack, archetypes and motion grammar."],
    ["sound-captions", "Voice as the clock; SRT/VTT; loudness."],
    ["video-qa", "Bounds, overflow, contrast, contact sheets."],
    ["resolve-handoff", "Plates, stems, FCPXML and markers."],
    ["youtube-packaging", "Title, thumbnails, chapters, private check."],
    ["agents", "director, scene-coder, visual-qa, packaging."],
  ];
  const skillGrid = el("div", "skill-grid");
  for (const [name, body] of skillList) {
    const card = el("article", name === "agents" ? "skill-card platform" : "skill-card");
    const label = name === "agents" ? "4 AGENTS" : `/${name}`;
    card.innerHTML = `<span class="skill-name">${label}</span><p>${body}</p>`;
    skillGrid.append(card);
  }
  skills.append(skillsHead, skillGrid);

  const docs = el("section", "section docs");
  docs.id = "docs";
  const docsHead = el("div", "section-head");
  docsHead.innerHTML = `
    <p class="eyebrow"><span class="square"></span> THE RECORD</p>
    <h2>Built in the open.</h2>
    <p class="section-lede">The grill, the spec, the tickets, the ADRs and the retro are part of the project.</p>
  `;
  const docsGrid = el("div", "docs-grid");
  const docLinks = [
    ["The grill", "docs/grilling.md", "The design tree and the decisions."],
    ["The spec", "docs/spec.md", "The v0 contract and acceptance."],
    ["Architecture", "docs/architecture.md", "Module seams and the renderer boundary."],
    ["ADRs", "docs/adr/", "The hard-to-reverse choices."],
    ["Research", "docs/research.md", "Why code, not generative video."],
    ["Retro", "docs/retro.md", "What the pilot taught us."],
  ];
  for (const [title, href, body] of docLinks) {
    const card = el("a", "doc-card");
    card.href = `https://github.com/gerrcass/stagecraft-studio/blob/main/${href}`;
    card.innerHTML = `<span class="doc-title">${title} <span>↗</span></span><p>${body}</p>`;
    docsGrid.append(card);
  }
  docs.append(docsHead, docsGrid);

  const footer = el("footer", "footer");
  footer.innerHTML = `
    <div class="footer-left"><span class="brand-mark"></span> STAGECRAFT STUDIO</div>
    <div class="footer-right">MIT · BUILT WITH OPENCODE / DEEPSEEK V4.1 FLASH · <a href="https://github.com/gerrcass/stagecraft-studio">GITHUB ↗</a></div>
  `;

  app.append(nav, hero, demo, strip, pipeline, skills, docs, footer);
};

void loadManifest().then(render);
