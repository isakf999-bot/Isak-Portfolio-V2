import { expect, test } from "@playwright/test";

test("phase 4 work globe has territories and a list toggle", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Selected sites and experiments.",
  );
  await expect(page.getByLabel("Territories")).toBeVisible();
  await expect(page.locator("[data-territory]")).toHaveCount(11);
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: "tests/baselines/phase4-work-globe-1440.png",
    fullPage: false,
  });
});

test("phase 4 list view is a first-class index", async ({ page }) => {
  await page.goto("/work");
  await page.locator("[data-atlas-view-toggle]").click();
  await expect(page.locator("[data-work-index]")).toBeVisible();
  await expect(page.getByRole("link", { name: /Jopas Bisyssla/ })).toBeVisible();
  await page.screenshot({
    path: "tests/baselines/phase4-work-list-1440.png",
    fullPage: false,
  });
});

test("phase 4 keyboard dive from the rail opens a survey", async ({ page }) => {
  await page.goto("/work");
  await page.waitForSelector("[data-globe-canvas] canvas", { timeout: 15000 });
  await page.locator("[data-territory='jopas']").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/jopas/, { timeout: 5000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Jopas Bisyssla",
  );
});

test("phase 4 filters erode the rail to one atlas class", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "Commerce", exact: true }).click();
  const slugs = await page.locator("[data-territory]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-territory")),
  );
  expect(slugs).toEqual(["jopas", "commerce"]);
});
