import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("phase 0 specimen renders tokens, grain, and reduced-motion grain freeze", async ({
  page,
}) => {
  await page.goto("/specimen");
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading", { name: "Isak" })).toBeVisible();
  await expect(page.locator(".grain")).toHaveCount(1);

  const grain = path.join(process.cwd(), "public/media/blue-noise.png");
  const bytes = fs.statSync(grain).size;
  expect(bytes).toBeLessThanOrEqual(6 * 1024);

  await page.screenshot({
    path: "tests/baselines/specimen-1440.png",
    fullPage: true,
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForLoadState("networkidle");

  const animation = await page.locator(".grain").evaluate((el) => {
    return window.getComputedStyle(el).animationName;
  });
  expect(animation === "none" || animation === "").toBeTruthy();

  await page.screenshot({
    path: "tests/baselines/specimen-1440-reduced.png",
    fullPage: true,
  });
});
