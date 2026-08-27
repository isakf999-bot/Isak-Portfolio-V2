export type AtlasClass = "commerce" | "systems" | "landing";
export type Terrain = "ridge" | "delta" | "plateau" | "archipelago";

export type AtlasMeta = {
  atlas: AtlasClass;
  terrain: Terrain;
  scale: number;
  seed: string;
  client: string;
  brief: string;
  decision: string;
};

export const atlasLabel: Record<AtlasClass, string> = {
  commerce: "Commerce",
  systems: "Systems",
  landing: "Landing",
};

export function getAtlas(slug: string): AtlasMeta {
  const meta = atlasMeta[slug];
  if (!meta) {
    throw new Error(`Missing atlas meta for ${slug}`);
  }
  return meta;
}

export const atlasMeta: Record<string, AtlasMeta> = {
  isakweb: {
    atlas: "landing",
    terrain: "ridge",
    scale: 1.45,
    seed: "isakweb-helsingborg-2026",
    client: "Isak Forsberg",
    brief:
      "A freelance studio needs a public front that sells the work: packages, cases, and a way in — not a resume dump.",
    decision:
      "Own site for the practice. Rejected a generic agency template. Every section has to push toward a real hire.",
  },
  jopas: {
    atlas: "commerce",
    terrain: "delta",
    scale: 1.4,
    seed: "jopas-soderasen-2026",
    client: "Jopas Bisyssla",
    brief: "A working honey farm on Söderåsen needed a live shop window that felt like the jars, not like a theme.",
    decision:
      "Custom React/Vite, not a shop template. Rejected urgency blocks, fake reviews, and stock rustic kits. Every section had to sell the product.",
  },
  luma: {
    atlas: "systems",
    terrain: "ridge",
    scale: 1.25,
    seed: "luma-stream-2026",
    client: "Studio",
    brief: "Prove a streaming UI can feel like a service: hero title, rows, hover, phone — not a poster grid.",
    decision:
      "Dark product chrome in React/TS. Rejected a static mock. Interaction is the design: carousels and a featured title that hold together.",
  },
  commerce: {
    atlas: "commerce",
    terrain: "delta",
    scale: 1.3,
    seed: "commerce-cloth-2026",
    client: "Studio",
    brief: "A clothing store has to carry browse, detail, cart, and checkout without dropping the thread.",
    decision:
      "Full flow in React + Tailwind. Rejected a grid-only demo. The cart drawer stays in context; checkout is stepped.",
  },
  nebula: {
    atlas: "landing",
    terrain: "plateau",
    scale: 1.05,
    seed: "nebula-saas-2026",
    client: "Studio",
    brief: "A SaaS landing that looks like analytics software, not a laptop stock photo.",
    decision:
      "Handcoded HTML/CSS/TS. Rejected a framework for a conversion page this small. The dashboard mock is the hero object.",
  },
  translate: {
    atlas: "systems",
    terrain: "ridge",
    scale: 0.7,
    seed: "translate-api-2025",
    client: "Studio",
    brief: "A translator that does one job: type, receive, read — no extra chrome.",
    decision:
      "React against a public API. Rejected a multi-tool dashboard. Loading and errors had to stay calm.",
  },
  "github-search": {
    atlas: "systems",
    terrain: "ridge",
    scale: 0.75,
    seed: "github-search-2025",
    client: "Studio",
    brief: "Search a GitHub user and show profile, repos, and followers without dumping JSON on the page.",
    decision:
      "React + GitHub API. Rejected a dense admin table. Hierarchy first, numbers second.",
  },
  planner: {
    atlas: "systems",
    terrain: "ridge",
    scale: 1.1,
    seed: "planner-tree-2026",
    client: "Studio",
    brief: "A planner that feels like the editor I work in: files, comments, type, colour.",
    decision:
      "VS Code grammar, not a notes app. Rejected a single-column todo list. The file tree is the navigation.",
  },
  "guess-word": {
    atlas: "systems",
    terrain: "archipelago",
    scale: 0.55,
    seed: "guess-word-2025",
    client: "Studio",
    brief: "A timed word game that is fair in five seconds: input, clock, score.",
    decision:
      "Vanilla JS. Rejected a framework for a loop this small. Rules live in the DOM.",
  },
  typing: {
    atlas: "systems",
    terrain: "archipelago",
    scale: 0.55,
    seed: "typing-loop-2025",
    client: "Studio",
    brief: "A typing test where the next word, the clock, and the score share one glance.",
    decision:
      "Handcoded JS, keyboard-first. Rejected delayed feedback. The loop is the interface.",
  },
  genesis: {
    atlas: "landing",
    terrain: "plateau",
    scale: 0.85,
    seed: "genesis-photo-2025",
    client: "Studio",
    brief: "A photo portfolio from Figma that still holds as HTML and CSS, with the pictures loudest.",
    decision:
      "No framework. Rejected JS for a static grid. The layout had to survive the browser intact.",
  },
  booking: {
    atlas: "landing",
    terrain: "plateau",
    scale: 0.65,
    seed: "booking-grid-2025",
    client: "Studio",
    brief: "A booking layout a person can read on a phone: when, what, next step.",
    decision:
      "HTML and CSS only. Rejected widget clutter. Mobile was the default, not a later breakpoint.",
  },
};
