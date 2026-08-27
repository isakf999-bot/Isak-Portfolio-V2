import { expect, test } from "@playwright/test";

test("phase 5 rail enter dives into a survey", async ({ page }) => {
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.locator("[data-territory='jopas']").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/jopas/, { timeout: 4000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Jopas Bisyssla",
  );
  await expect(page.locator("[data-survey-rule]")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-dive", "hold", {
    timeout: 3000,
  });
  await page.screenshot({
    path: "tests/baselines/phase5-survey-jopas-1440.png",
    fullPage: false,
  });
});

test("phase 5 atlas back reverses onto the globe", async ({ page }) => {
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.locator("[data-territory='jopas']").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/jopas/, { timeout: 4000 });
  await expect(page.locator("html")).toHaveAttribute("data-dive", "hold", {
    timeout: 3000,
  });
  await page.getByRole("link", { name: "← Atlas" }).click({ force: true });
  await expect(page).toHaveURL(/\/work$/, { timeout: 4000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Selected sites and experiments.",
  );
  await expect(page.locator("[data-globe-canvas] canvas")).toHaveCount(1);
  await page.waitForTimeout(900);
  await page.screenshot({
    path: "tests/baselines/phase5-reverse-work-1440.png",
    fullPage: false,
  });
});

test("phase 5 next survey keeps the canvas alive", async ({ page }) => {
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.locator("[data-territory='jopas']").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/jopas/, { timeout: 4000 });
  await expect(page.locator("html")).toHaveAttribute("data-dive", "hold", {
    timeout: 3000,
  });
  await expect(page.locator("[data-globe-canvas] canvas")).toHaveCount(1);
  await page.locator("[data-next-survey]").click({ force: true });
  await expect(page).toHaveURL(/\/work\/luma/, { timeout: 4000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("LUMA");
  await expect(page.locator("[data-globe-canvas] canvas")).toHaveCount(1);
});

test("phase 5 reduced motion opens a survey immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  await page.waitForSelector("[data-territory='jopas']");
  await page.locator("[data-territory='jopas']").click({ force: true });
  await expect(page).toHaveURL(/\/work\/jopas/, { timeout: 2500 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Jopas Bisyssla",
  );
});
