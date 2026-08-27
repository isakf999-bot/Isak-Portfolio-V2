import { expect, test } from "@playwright/test";

test("phase 6 experience has a strata column and year ticks", async ({ page }) => {
  await page.goto("/experience");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "School, then a live product.",
  );
  await expect(page.getByText("Jan 2026", { exact: true })).toBeVisible();
  await page.waitForSelector("[data-strata-column] canvas", { timeout: 15000 });
  await expect(page.locator("[data-strata-details]")).toBeVisible();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "tests/baselines/phase6-experience-1440.png",
    fullPage: false,
  });
});

test("phase 6 contact draws a waveform beside the form", async ({ page }) => {
  await page.goto("/contact");
  await page.waitForSelector("[data-waveform] canvas", { timeout: 15000 });
  await page.locator("textarea[name='message']").fill("hello from helsingborg");
  await expect(page.locator("[data-waveform] canvas")).toHaveCount(1);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "tests/baselines/phase6-contact-1440.png",
    fullPage: false,
  });
});

test("phase 6 write articles compile from MDX", async ({ page }) => {
  await page.goto("/write/finish-the-thing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Finish the thing properly",
  );
  await expect(page.getByRole("heading", { level: 2 })).toContainText(
    "The last five percent",
  );
  await expect(page.locator("[data-note-code]")).toContainText("lib/wind.ts");
  await page.screenshot({
    path: "tests/baselines/phase6-write-mdx-1440.png",
    fullPage: false,
  });
});

test("phase 6 reduced motion still shows experience copy", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experience");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Strafe.com").first()).toBeVisible();
});
