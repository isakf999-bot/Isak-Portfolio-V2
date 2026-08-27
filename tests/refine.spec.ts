import { expect, test, type Page } from "@playwright/test";

const PAGE_ROUTES = [
  "/work",
  "/experience",
  "/about",
  "/write",
  "/contact",
  "/cv",
];

async function atlasCanvas(page: Page) {
  const slot = page.locator("[data-globe-slot]");
  await slot.waitFor({ timeout: 15000 });
  await slot.evaluate((el) => el.scrollIntoView({ block: "center", inline: "center" }));
  await page.waitForFunction(
    () => {
      const canvas = document.querySelector("[data-globe-canvas]");
      if (!(canvas instanceof HTMLElement)) return false;
      const r = canvas.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const rig = Boolean((window as unknown as { __globeRig?: boolean }).__globeRig);
      return r.width > 80 && mid > 80 && mid < window.innerHeight - 40 && rig;
    },
    { timeout: 8000 },
  );
  const canvas = page.locator("[data-globe-canvas] canvas");
  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  return { canvas, box: box! };
}

test("refine 1 hero wordmark is Isak and stays inside the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText(/^Isak$/);
  const box = await heading.boundingBox();
  expect(box).toBeTruthy();
  expect((box?.x ?? 0) + (box?.width ?? 9999)).toBeLessThanOrEqual(321);
  const overflow = await page.evaluate(() => {
    return {
      ok: document.documentElement.scrollWidth <= window.innerWidth + 1,
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
    };
  });
  expect(overflow, JSON.stringify(overflow)).toMatchObject({ ok: true });
});

test("refine 2 page headings stay on the page ramp", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of PAGE_ROUTES) {
    await page.goto(path);
    const px = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
      return Number.parseFloat(getComputedStyle(el).fontSize);
    });
    expect(px, `${path} h1 ${px}px`).toBeLessThanOrEqual(64.5);
  }
  const mega = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue(
      "--text-mega",
    );
  });
  expect(mega.trim()).toBe("");
});

test("refine 3 hover inverts a landmass and raises the HUD", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  const { box } = await atlasCanvas(page);
  const hud = page.locator("[data-globe-hud]");
  for (let y = 0.25; y <= 0.75; y += 0.1) {
    for (let x = 0.25; x <= 0.75; x += 0.1) {
      await page.mouse.move(box.x + box.width * x, box.y + box.height * y);
      if (await hud.isVisible().catch(() => false)) break;
    }
    if (await hud.isVisible().catch(() => false)) break;
  }
  await expect(hud).toBeVisible({ timeout: 4000 });
  await expect(hud).toContainText(/ENTER/);
});

test("refine 4 territories carry persistent name captions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await expect(page.locator("[data-globe-caption]")).toHaveCount(11);
});

test("refine 5 angular velocity never exceeds 1.1 rad/s", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  const { box } = await atlasCanvas(page);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 240, cy, { steps: 8 });
  const omega = await page.locator("[data-globe-canvas]").getAttribute("data-omega");
  await page.mouse.up();
  expect(omega, "omega probe on the canvas").toBeTruthy();
  expect(Number(omega)).toBeLessThanOrEqual(1.1);
});

test("refine 6 circular drags never navigate", async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  const { box } = await atlasCanvas(page);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const r = Math.min(box.width, box.height) * 0.22;
  for (let n = 0; n < 100; n += 1) {
    await page.mouse.move(cx + r, cy);
    await page.mouse.down();
    for (let i = 1; i <= 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      await page.mouse.move(cx + Math.cos(a) * r, cy + Math.sin(a) * r, {
        steps: 1,
      });
    }
    await page.mouse.up();
  }
  await expect(page).toHaveURL(/\/work\/?$/);
});

const OVERFLOW_ROUTES = ["/", "/work", "/experience", "/about", "/write", "/contact", "/cv"];
const OVERFLOW_WIDTHS = [320, 390, 768, 1440, 2560];

for (const reduced of [false, true]) {
  for (const width of OVERFLOW_WIDTHS) {
    test(`refine overflow ${width} ${reduced ? "reduced" : "motion"}`, async ({
      page,
    }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width, height: 800 });
      if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
      for (const path of OVERFLOW_ROUTES) {
        await page.goto(path);
        const ok = await page.evaluate(() => {
          const root = document.documentElement;
          if (root.scrollWidth > window.innerWidth + 1) return false;
          const nodes = document.body.querySelectorAll("*");
          for (const node of nodes) {
            if (
              node.classList.contains("sr-only") ||
              node.classList.contains("skip-link") ||
              node.classList.contains("crosshair") ||
              node.classList.contains("grain")
            ) {
              continue;
            }
            const style = getComputedStyle(node);
            if (style.position === "fixed" || style.position === "sticky") continue;
            if (style.transform !== "none") continue;
            const r = node.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) continue;
            if (r.right > window.innerWidth + 2 || r.left < -2) return false;
          }
          return true;
        });
        expect(ok, `${path} @ ${width}`).toBeTruthy();
      }
    });
  }
}
