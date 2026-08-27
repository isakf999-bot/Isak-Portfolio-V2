import { expect, test } from "@playwright/test";

test("phase 3 work page draws one globe canvas", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("[data-globe-slot]")).toHaveCount(1);
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await expect(page.locator("[data-globe-canvas] canvas")).toHaveCount(1);
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "tests/baselines/phase3-work-1440.png",
    fullPage: false,
  });
});

test("phase 3 home tease shows the idle planet after the dissolve", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-globe-slot]").scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "tests/baselines/phase3-home-tease-1440.png",
    fullPage: false,
  });
});

test("phase 3 canvas survives a client route change without a slot", async ({
  page,
}) => {
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.getByLabel("Primary").getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about/);
  await expect(page.locator("[data-globe-slot]")).toHaveCount(0);
  await expect(page.locator("[data-globe-canvas] canvas")).toHaveCount(1);
});

test("phase 3 reduced motion still paints a globe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.screenshot({
    path: "tests/baselines/phase3-work-reduced.png",
    fullPage: false,
  });
});
