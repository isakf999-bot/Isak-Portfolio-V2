import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  ["/", "home"],
  ["/work", "work"],
  ["/experience", "experience"],
  ["/about", "about"],
  ["/write", "write"],
  ["/contact", "contact"],
  ["/cv", "cv"],
] as const;

const widths = [
  [390, 844],
  [768, 1024],
  [1440, 900],
  [2560, 1440],
] as const;

test("ship hover on a territory shows the survey label", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await expect(page.locator("[data-globe-caption]").first()).toContainText(
    "Jopas Bisyssla",
  );
});

test("ship webgl-off is the typographic index", async ({ page }) => {
  await page.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype;
    const original = proto.getContext;
    proto.getContext = function getContext(type, ...args) {
      if (String(type).includes("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto("/work");
  await expect(page.locator("[data-work-index]")).toBeVisible();
  await expect(page.getByRole("link", { name: /Jopas Bisyssla/ })).toBeVisible();
  await expect(page.locator("[data-globe-canvas]")).toHaveCount(0);
  await page.screenshot({
    path: "tests/baselines/ship-work-nowebgl-1440.png",
    fullPage: false,
  });
});

test("ship saveData never requests the forest decoder", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      get: () => ({ saveData: true, effectiveType: "4g" }),
    });
  });
  const videos: string[] = [];
  page.on("request", (req) => {
    if (/\.(mp4|webm)(\?|$)/.test(req.url())) videos.push(req.url());
  });
  await page.goto("/");
  await page.waitForTimeout(1200);
  expect(videos).toEqual([]);
  await expect(page.locator("video")).toHaveCount(0);
});

test("ship two-hundred percent zoom still shows the arrival", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached();
  await expect(page.getByRole("link", { name: "View work" })).toBeVisible();
});

test("ship holding the plate reveals colour", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-home-arrival]")).toHaveAttribute(
    "data-chroma",
    "ink",
  );
  await page.keyboard.down("c");
  await expect(page.locator("[data-home-arrival]")).toHaveAttribute(
    "data-chroma",
    "live",
    { timeout: 1500 },
  );
  await page.keyboard.up("c");
});

test("ship about is a quiet plate", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("[data-portrait-plate]")).toBeVisible();
  await expect(page.locator("[data-draw-rule]")).toHaveCount(1);
  await expect(page.getByRole("img", { name: "Isak Forsberg" })).toBeVisible();
});

for (const [path, name] of routes) {
  for (const [width, height] of widths) {
    test(`ship ${name} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.screenshot({
        path: `tests/baselines/ship-${name}-${width}.png`,
        fullPage: false,
      });
    });
  }
}

for (const [path, name] of routes) {
  test(`ship reduced ${name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual(
      [],
    );
    await page.screenshot({
      path: `tests/baselines/ship-${name}-1440-reduced.png`,
      fullPage: false,
    });
  });
}
