export type ProjectKind = "client" | "react" | "handcoded" | "game";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  url: string;
  kind: ProjectKind;
  featured?: boolean;
  year: string;
  role: string;
  problem: string;
  approach: string;
  outcome: string;
  highlights: string[];
};

export type Lithology = "till" | "granite" | "shale";

export type Role = {
  id: string;
  org: string;
  title: string;
  dates: string;
  months: number;
  body: string;
  notes?: string[];
  kind: "course" | "job";
  lithology: Lithology;
};

export const profile = {
  name: "Isak Forsberg",
  role: "Fullstack developer",
  city: "Helsingborg",
  country: "Sweden",
  lat: "56.0465° N",
  lon: "12.6945° E",
  tz: "Europe/Stockholm",
  age: 21,
  phone: "+46 76 251 41 21",
  email: "Isakf999@gmail.com",
  availability: "Available 2026",
  available: true,
  github: "https://github.com/isakf999-bot",
  instagram: "https://instagram.com/isakforsberg11",
  linkedin: "https://www.linkedin.com/in/isakforsberg05",
  x: "https://x.com/FoppaCS",
};

export const skills = {
  markup: ["HTML5", "CSS3", "Sass"],
  language: ["JavaScript", "TypeScript"],
  interface: ["React", "Tailwind CSS", "Figma"],
  workflow: ["GitHub", "Node.js"],
};

export const skillList = [
  ...skills.markup,
  ...skills.language,
  ...skills.interface,
  ...skills.workflow,
];

export const projects: Project[] = [
  {
    slug: "isakweb",
    title: "Isakweb",
    summary:
      "My freelance fullstack studio site — packages, case studies, and a clear path to hire me for client work.",
    tags: ["Next.js", "React", "Freelance"],
    url: "https://www.isakweb.se/",
    kind: "client",
    featured: true,
    year: "2026",
    role: "Design and front-end",
    problem:
      "A freelance offer needs a shop window that sells the service: what you get, what it costs, and proof — without looking like a template agency.",
    approach:
      "Built as a live marketing site for my own practice. Clear packages, selected cases, and contact that leads somewhere. The site has to convert visitors into conversations.",
    outcome:
      "Live at isakweb.se. The place I send people when they ask what I build for clients — and where new clients find me.",
    highlights: [
      "Live freelance studio site",
      "Packages and case path to contact",
      "Built to get hired, not just to look busy",
    ],
  },
  {
    slug: "jopas",
    title: "Jopas Bisyssla",
    summary:
      "Live client site for a small-scale honey farm on Söderåsen — warm, crafted, and built to sell the product without looking like a template.",
    tags: ["React", "Vite", "Client"],
    url: "https://www.jopasbisyssla.se/",
    kind: "client",
    featured: true,
    year: "2026",
    role: "Design and front-end",
    problem:
      "A real farm needed a shop window that felt like the product: local honey, not a theme. The previous look would have been any small-business template.",
    approach:
      "Built in React and Vite with a tight type system, product photography, and pages that sell without shouting. Every block had to earn its place — no stock sections, no fake urgency.",
    outcome:
      "The site is live at jopasbisyssla.se. It is the first client project I shipped end to end: brief, build, and launch.",
    highlights: [
      "Live production site, not a mock",
      "Custom visual system for a food brand",
      "Product-led layout instead of a generic landing stack",
    ],
  },
  {
    slug: "luma",
    title: "LUMA",
    summary:
      "A Netflix-inspired streaming concept with a featured-title hero, trending carousel, and a dark UI that behaves like a real service.",
    tags: ["React", "TypeScript", "CSS"],
    url: "https://netflix-inspired-website.vercel.app/",
    kind: "react",
    featured: true,
    year: "2026",
    role: "Front-end",
    problem:
      "Streaming UIs fail when they look like a gallery of posters. The hard part is rhythm: hero, rows, hover, and enough chrome to feel like a product.",
    approach:
      "A full-width featured title, horizontal carousels, and a dark surface system in React and TypeScript. Interaction is the design — hover states, row scrolling, and a layout that still works on a phone.",
    outcome:
      "A concept that reads as a service, not a class exercise. Useful as a proof that I can hold a complex entertainment UI together.",
    highlights: [
      "Featured-title hero and trending rows",
      "Dark UI with product-level density",
      "Responsive carousel behaviour",
    ],
  },
  {
    slug: "commerce",
    title: "E-commerce clothing",
    summary:
      "Full shopping flow: category browse, product pages with sizing, a live cart drawer, and multi-step checkout.",
    tags: ["React", "TypeScript", "Tailwind"],
    url: "https://e-commerce-clothing-sable.vercel.app/",
    kind: "react",
    featured: true,
    year: "2026",
    role: "Front-end",
    problem:
      "Most student shops stop at a product grid. A clothing store has to carry browse, detail, cart, and checkout without dropping the thread.",
    approach:
      "Category pages, product views with sizing, a cart drawer that stays in context, and a multi-step checkout. Tailwind for a tight clothing-shop surface rather than a dashboard look.",
    outcome:
      "A complete path from browse to pay. The piece I point to when someone asks if I can build a real storefront, not just a landing page.",
    highlights: [
      "Cart drawer with live state",
      "Sizing on product pages",
      "Multi-step checkout",
    ],
  },
  {
    slug: "nebula",
    title: "Nebula analytics",
    summary:
      "Conversion-focused SaaS landing with a live dashboard mockup, a bento feature grid, and a hover dropdown in the nav.",
    tags: ["HTML", "CSS", "TypeScript"],
    url: "https://landingpage-portfolio-orpin.vercel.app/",
    kind: "handcoded",
    year: "2026",
    role: "Handcoded front-end",
    problem:
      "SaaS landings collapse into identical feature grids. Nebula needed to look like analytics software: data in the hero, not a stock photo of a laptop.",
    approach:
      "Handcoded HTML, CSS, and TypeScript. A dashboard mock as the hero object, a bento of product claims, and a nav dropdown that behaves like a real marketing site.",
    outcome:
      "A landing that sells a product category without a framework. Proof that I can structure conversion pages from scratch.",
    highlights: [
      "Dashboard mock in the hero",
      "Bento feature layout",
      "Marketing nav with hover menus",
    ],
  },
  {
    slug: "translate",
    title: "Translate app",
    summary:
      "Clean, responsive translator that talks to a public API for live results.",
    tags: ["React", "API"],
    url: "https://translate-app-l4e1.vercel.app/",
    kind: "react",
    year: "2025",
    role: "Front-end",
    problem:
      "Utility apps get noisy. A translator should be a quiet box that does one job and shows the result immediately.",
    approach:
      "React UI wired to a public translation API. Minimal chrome, clear input and output, and a layout that stays usable on a phone.",
    outcome:
      "A small product with a real network round-trip — useful practice for loading, errors, and a calm utility interface.",
    highlights: [
      "Live API results",
      "Quiet two-pane layout",
      "Mobile-first input",
    ],
  },
  {
    slug: "github-search",
    title: "GitHub profile search",
    summary:
      "Search GitHub users and read repositories, followers, and profile details in a quiet layout.",
    tags: ["React", "API"],
    url: "https://github-profile-search-cyan.vercel.app/",
    kind: "react",
    year: "2025",
    role: "Front-end",
    problem:
      "GitHub data is dense. The job was to search a user and present profile, repos, and followers without turning it into a dashboard dump.",
    approach:
      "React against the GitHub API. Search first, then a readable profile with the numbers that actually matter.",
    outcome:
      "A working explorer that taught me how to shape third-party JSON into a layout people can scan.",
    highlights: [
      "User search against GitHub",
      "Repos and followers in one view",
      "Quiet information hierarchy",
    ],
  },
  {
    slug: "planner",
    title: "Project planner",
    summary:
      "A planner with a VS Code-like file tree, comments, fonts, and a color palette — structure for real builds.",
    tags: ["React", "UI"],
    url: "https://project-planner-app-gamma.vercel.app/",
    kind: "react",
    year: "2026",
    role: "Front-end",
    problem:
      "Planning tools often look like notes apps. I wanted something that feels like the editor I actually work in: files, comments, type, color.",
    approach:
      "A file-tree sidebar, comment threads, font choices, and a palette panel. React UI that borrows the grammar of VS Code without copying the chrome.",
    outcome:
      "A studio tool concept — the kind of interface I like building: dense, specific, and meant for making things.",
    highlights: [
      "File-tree navigation",
      "Comments and type controls",
      "Palette as a first-class panel",
    ],
  },
  {
    slug: "guess-word",
    title: "Guess the word",
    summary:
      "Timed word game with a score system and a fresh word each round.",
    tags: ["JavaScript", "Game"],
    url: "https://guess-word-game-three.vercel.app/",
    kind: "game",
    year: "2025",
    role: "Handcoded JavaScript",
    problem:
      "A game has to be fair and readable in the first five seconds: what to type, how long you have, what the score means.",
    approach:
      "Vanilla JavaScript. Timer, scoring, and a new word each round. No framework — just state, DOM, and the loop.",
    outcome:
      "A small game that still has rules. Useful for timing, input, and keeping a player oriented.",
    highlights: [
      "Round timer and score",
      "Fresh word each play",
      "No framework, just JS",
    ],
  },
  {
    slug: "typing",
    title: "Typing game",
    summary:
      "Handcoded typing challenge — timer, score, and words that keep coming.",
    tags: ["JavaScript", "Game"],
    url: "https://typing-game-js.vercel.app/",
    kind: "game",
    year: "2025",
    role: "Handcoded JavaScript",
    problem:
      "Typing tests die when feedback is late. The player needs to see the next word, the clock, and the score in one glance.",
    approach:
      "Handcoded JS with a tight loop: words arrive, the timer runs, the score updates. Layout stays out of the way of the keyboard.",
    outcome:
      "A practice piece for game loops and input. Still one of the clearest things I have built in plain JavaScript.",
    highlights: [
      "Continuous word stream",
      "Live timer and score",
      "Keyboard-first UI",
    ],
  },
  {
    slug: "genesis",
    title: "Genesis",
    summary:
      "Photo portfolio built from scratch in HTML and CSS, with Figma as the design source.",
    tags: ["HTML", "CSS", "Figma"],
    url: "https://genesiswebsiteisak.netlify.app/",
    kind: "handcoded",
    year: "2025",
    role: "Design and front-end",
    problem:
      "A photo site has to carry images, not chrome. The layout had to come from Figma and survive as handcoded HTML and CSS.",
    approach:
      "Designed in Figma, then built with no framework. Grid, type, and spacing doing the work so the photographs stay loudest.",
    outcome:
      "A static portfolio that still looks intended. The project where I learned to protect a layout from the browser.",
    highlights: [
      "Figma to handcoded CSS",
      "Image-led grid",
      "No JavaScript required",
    ],
  },
  {
    slug: "booking",
    title: "Booking concept",
    summary:
      "A simple booking layout in handcoded HTML and CSS — clean grid, works on a phone.",
    tags: ["HTML", "CSS"],
    url: "https://website-test-chi-blush.vercel.app/",
    kind: "handcoded",
    year: "2025",
    role: "Handcoded front-end",
    problem:
      "Booking pages get cluttered with widgets. I wanted a layout that a person can read on a phone: when, what, next step.",
    approach:
      "Handcoded HTML and CSS. A clean grid, clear hierarchy, and no framework weight. Mobile was the default, not a breakpoint fix.",
    outcome:
      "A small concept that still holds as a booking surface — structure first, decoration last.",
    highlights: [
      "Phone-first grid",
      "Clear booking hierarchy",
      "HTML and CSS only",
    ],
  },
];

export const education: Role[] = [
  {
    id: "frontend",
    org: "Sundsgården Folk High School",
    title: "Front-end developer",
    dates: "Jan 2026 — Jun 2026",
    months: 6,
    kind: "course",
    lithology: "till",
    body: "Vocational training in web development and modern workflows. HTML, CSS, JavaScript, Git/GitHub, Figma, agile methods, and collaborative projects.",
    notes: [
      "Layout, type, and responsive CSS as daily craft",
      "Git as a team tool, not a solo backup",
      "Figma to browser without losing the design",
    ],
  },
  {
    id: "backend",
    org: "Sundsgården Folk High School",
    title: "Back-end developer",
    dates: "Aug 2026 — Dec 2026",
    months: 5,
    kind: "course",
    lithology: "shale",
    body: "Server-side applications with JavaScript, TypeScript, Node.js, REST APIs, SQL and NoSQL, authentication, security, testing, Git, Docker, and agile team work.",
    notes: [
      "APIs and data modelling so front-end is not a dead end",
      "Auth, testing, and Docker in a real course setting",
      "Aim: own more of the stack on client work",
    ],
  },
];

export const work: Role[] = [
  {
    id: "strafe",
    org: "Strafe.com",
    title: "Front-end developer — summer temp",
    dates: "Jun 2026 — Jul 2026",
    months: 2,
    kind: "job",
    lithology: "granite",
    body: "Bugs, new features, and UX on a live product. Worked with one developer, learned branches and pull requests, and how a company decides what ships next.",
    notes: [
      "Shipped against a live codebase, not a sandbox",
      "PRs, review, and the cost of a sloppy branch",
      "Product taste: what is worth building this week",
    ],
  },
];

export const about = {
  lede: "I'm Isak Forsberg, 21, a fullstack developer from Helsingborg. I design and build websites and the APIs behind them — clear layout, solid interaction, and no half-done edges.",
  body: [
    "I work across the stack: React, JavaScript, TypeScript, HTML, CSS, and Figma on the front — Node, REST APIs, databases, auth, and Docker when the product needs a real back-end. Daily craft is turning a brief into something a person can use on a phone without fighting it.",
    "Right now I study back-end at Sundsgården Folk High School — deepening APIs, data, security, and deployment — so client work does not stop at the browser. I already ship with back-end when the job needs it. The course makes that sharper, not optional.",
    "Before that I trained as a front-end developer at the same school, and spent a summer as a front-end temp at Strafe.com: bugs, features, pull requests, and shipping against a live product with another developer. That is where the difference between a demo and a real codebase stopped being theoretical.",
    "On the side I run a freelance practice through isakweb.se — landing pages, React UI, Figma-to-code, full-site builds, and polish for small businesses that need something that sells without looking like a template. Jopas Bisyssla was the first client end-to-end: brief, build, and launch.",
    "I care about the boring details that make a product feel expensive: spacing, type, hover states, performance, API errors that stay calm, and whether checkout or contact still makes sense when you are tired and on mobile data.",
    "Outside the editor I have played hockey for 14 years. That shows up in how I work. Show up. Finish the shift. No shortcuts that look fine until someone clicks.",
  ],
  now: [
    "Based in Helsingborg, available for freelance fullstack work in 2026.",
    "Studying back-end at Sundsgården while taking on client sites, UI, and API work.",
    "Building in public through selected projects on this portfolio and the studio site.",
  ],
  offer: [
    "Marketing and landing sites that convert without looking generic.",
    "React interfaces with clear hierarchy and calm interaction.",
    "APIs, auth, and data wiring so the front-end is not a dead end.",
    "Figma-to-code that keeps the design intent in the browser.",
    "Polish passes: spacing, type, motion, and mobile behaviour on an existing site.",
  ],
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function adjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return { prev: undefined, next: undefined };
  return {
    prev: projects[index - 1],
    next: projects[index + 1],
  };
}

export const featuredProjects = projects.filter((project) => project.featured);

export const kindLabel: Record<ProjectKind, string> = {
  client: "Client",
  react: "React",
  handcoded: "Handcoded",
  game: "Game",
};
