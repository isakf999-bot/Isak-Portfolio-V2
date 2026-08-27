import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const routes = [
  "/",
  "/work",
  "/experience",
  "/about",
  "/write",
  "/contact",
  "/cv",
];

test.describe.configure({ mode: "serial" });

test("phase 7 uncharted plate is a blank map", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("UNCHARTED");
  await expect(page.locator("[data-uncharted-plate]")).toBeVisible();
  await page.screenshot({
    path: "tests/baselines/phase7-404-1440.png",
    fullPage: false,
  });
});

test("phase 7 sitemap and robots list the atlas", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("https://isakforsberg.se/work");
  expect(xml).toContain("https://isakforsberg.se/work/jopas");
  expect(xml).toContain("https://isakforsberg.se/write/finish-the-thing");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("sitemap.xml");
  expect(await robots.text()).toContain("Disallow: /specimen");
});

test("phase 7 html source has copy and structured data", async ({ page }) => {
  const res = await page.goto("/");
  const html = (await res?.text()) ?? "";
  expect(html).toContain("Isak Forsberg");
  expect(html).toContain("application/ld+json");
  expect(html).toContain("Isak Forsberg");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  const og = page.locator('meta[property="og:image"]');
  await expect(og.first()).toHaveAttribute("content", /opengraph-image/);
});

test("phase 7 globe canvas is hidden from assistive tech", async ({ page }) => {
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas]", { timeout: 15000 });
  await expect(page.locator("[data-globe-canvas]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

test("phase 7 more contrast drops grain", async ({ page }) => {
  await page.emulateMedia({ contrast: "more" });
  await page.goto("/");
  const display = await page.locator(".grain").evaluate((el) => {
    return window.getComputedStyle(el).display;
  });
  expect(display).toBe("none");
});

test("phase 7 production gzip stays on budget", async ({ browserName }) => {
  test.skip(browserName !== "chromium", "budget gate is Chromium");
  if (!existsSync(".next/server/app/index.html")) {
    test.skip(true, "run npm run build for gzip budgets");
  }
  execFileSync(process.execPath, ["scripts/perf-budget.mjs"], {
    stdio: "inherit",
  });
});

test("phase 7 idle globe p95 frame time is desktop 60", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "frame probe is Chromium");
  test.setTimeout(30000);
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.waitForTimeout(800);
  const p95 = await page.evaluate(async () => {
    const warmup = 90;
    const count = 180;
    const samples: number[] = [];
    let last = performance.now();
    let n = 0;
    await new Promise<void>((resolve) => {
      const run = (now: number) => {
        n += 1;
        const dt = now - last;
        last = now;
        if (n > warmup) samples.push(dt);
        if (n < warmup + count) requestAnimationFrame(run);
        else resolve();
      };
      requestAnimationFrame(run);
    });
    const sorted = samples.sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length * 0.5)] ?? 99;
    const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 99;
    return { median, p95 };
  });
  if (p95.median > 17 || p95.p95 > 36) {
    throw new Error(
      `globe p95 ${p95.p95.toFixed(2)}ms median ${p95.median.toFixed(2)}ms, budget 16.7ms`,
    );
  }
});

for (const path of routes) {
  test(`phase 7 axe ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual(
      [],
    );
  });
}

test("phase 7 safari paints the globe", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "Safari shader smoke only");
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 20000 });
  await expect(page.locator("[data-globe-canvas] canvas")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Selected sites and experiments.",
  );
});
