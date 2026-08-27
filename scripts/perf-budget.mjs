import { gzipSync } from "node:zlib";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const JS_BUDGET = 180 * 1024;
const HOME_BUDGET = 3.5 * 1024 * 1024;
const ROUTE_BUDGET = 900 * 1024;
const ROOT = process.cwd();

function gzipFile(rel) {
  return gzipSync(readFileSync(join(ROOT, rel))).length;
}

function htmlAssets(htmlPath) {
  if (!existsSync(htmlPath)) {
    throw new Error(`perf-budget: missing ${htmlPath}. Run npm run build.`);
  }
  const html = readFileSync(htmlPath, "utf8");
  const scripts = [...html.matchAll(/<script([^>]+)><\/script>/g)].map(
    (m) => m[1],
  );
  const links = [...html.matchAll(/<link([^>]+)>/g)].map((m) => m[1]);
  const files = new Set();

  for (const attrs of scripts) {
    if (/nomodule/i.test(attrs)) continue;
    const src = attrs.match(/src="([^"]+)"/)?.[1];
    if (src?.includes("/_next/static/")) {
      files.add(src.replace("/_next/", ".next/"));
    }
  }
  for (const attrs of links) {
    const href = attrs.match(/href="([^"]+)"/)?.[1];
    if (href?.includes("/_next/static/") && /\.(js|css|woff2)$/.test(href)) {
      files.add(href.replace("/_next/", ".next/"));
    }
  }
  return [...files];
}

function loadableFiles(manifestPath) {
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const files = [];
  for (const entry of Object.values(manifest)) {
    for (const file of entry.files ?? []) {
      files.push(join(".next", file));
    }
  }
  return [...new Set(files)];
}

function sumGzip(files) {
  const rows = files.map((file) => ({ file, gz: gzipFile(file) }));
  rows.sort((a, b) => b.gz - a.gz);
  return {
    total: rows.reduce((sum, row) => sum + row.gz, 0),
    rows,
  };
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const indexHtml = join(ROOT, ".next/server/app/index.html");
const homeFiles = htmlAssets(indexHtml);
const homeJsFiles = homeFiles.filter((file) => file.endsWith(".js"));
const homeJs = sumGzip(homeJsFiles);

console.log("Home module scripts:");
for (const row of homeJs.rows) {
  console.log(`  ${(row.gz / 1024).toFixed(1)}KB  ${row.file}`);
}
console.log(
  `first-load JS ${(homeJs.total / 1024).toFixed(1)}KB gzipped, budget ${JS_BUDGET / 1024}KB`,
);
if (homeJs.total > JS_BUDGET) {
  fail(`home JS ${(homeJs.total / 1024).toFixed(1)}KB, budget ${JS_BUDGET / 1024}KB`);
}

const lazyHome = loadableFiles(
  join(ROOT, ".next/server/app/page/react-loadable-manifest.json"),
);
const firstLoad = new Set(homeJsFiles.map((file) => file.replaceAll("\\", "/")));
for (const file of lazyHome) {
  const gz = gzipFile(file);
  const norm = file.replaceAll("\\", "/");
  if (gz > 80 * 1024 && firstLoad.has(norm)) {
    fail("globe chunk is in first-load JS; it must stay lazy (ssr: false)");
  }
}

const mp4 = join(ROOT, "public/media/hero-forest.mp4");
const webm = join(ROOT, "public/media/hero-forest.webm");
const video = Math.max(
  existsSync(mp4) ? statSync(mp4).size : 0,
  existsSync(webm) ? statSync(webm).size : 0,
);
const homeOther = sumGzip(homeFiles.filter((file) => !file.endsWith(".js")));
const homeTotal = homeJs.total + homeOther.total + video;
console.log(
  `home weight ${(homeTotal / (1024 * 1024)).toFixed(2)}MB including video, budget 3.5MB`,
);
if (homeTotal > HOME_BUDGET) {
  fail(
    `home weight ${(homeTotal / (1024 * 1024)).toFixed(2)}MB, budget 3.5MB`,
  );
}

const workFiles = htmlAssets(join(ROOT, ".next/server/app/work.html"));
const work = sumGzip(workFiles);
const lazyWork = loadableFiles(
  join(ROOT, ".next/server/app/work/page/react-loadable-manifest.json"),
);
const workLazy = sumGzip(
  lazyWork.filter((file) => !workFiles.includes(file.replaceAll("\\", "/"))),
);
const workTotal = work.total + workLazy.total;
console.log(
  `work weight ${(workTotal / 1024).toFixed(1)}KB gzipped (globe ${(workLazy.total / 1024).toFixed(1)}KB), budget 900KB`,
);
if (workTotal > ROUTE_BUDGET) {
  fail(`work weight ${(workTotal / 1024).toFixed(1)}KB, budget 900KB`);
}

if (process.exitCode === 1) process.exit(1);
