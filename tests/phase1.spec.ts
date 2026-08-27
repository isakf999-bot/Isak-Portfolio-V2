import { expect, test } from "@playwright/test";

const routes = [
  ["/", "Isak"],
  ["/work", "Selected sites and experiments."],
  ["/work/jopas", "Jopas Bisyssla"],
  ["/experience", "School, then a live product."],
  ["/about", "Built by hand. Finished properly."],
  ["/contact", "Isakf999@gmail.com"],
  ["/write", "Finish the thing properly"],
  ["/cv", "Isak Forsberg"],
];

for (const [path, heading] of routes) {
  test(`phase 1 ${path} has heading and grain`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    await expect(page.locator(".grain")).toHaveCount(1);
    const name = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
    await page.screenshot({
      path: `tests/baselines/phase1-${name}-1440.png`,
      fullPage: false,
    });
  });
}

test("phase 1 reduced motion still shows composed home", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: "tests/baselines/phase1-home-reduced.png" });
});
