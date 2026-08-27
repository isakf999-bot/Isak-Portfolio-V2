import { expect, test } from "@playwright/test";

test("part 2 hairline tokens are physical", async ({ page }) => {
  await page.goto("/");
  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      hair: styles.getPropertyValue("--rule-hair").trim(),
      base: styles.getPropertyValue("--rule-base").trim(),
      heavy: styles.getPropertyValue("--rule-heavy").trim(),
      dpr: styles.getPropertyValue("--dpr").trim(),
    };
  });
  expect(tokens.base).toBe("1px");
  expect(tokens.heavy).toBe("2px");
  expect(tokens.hair).toMatch(/px|calc/);
  expect(Number.parseFloat(tokens.dpr)).toBeGreaterThan(0);
});

test("part 2 ctrl+g draws the 8pt grid", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => Boolean(window.__toggleGrid));
  await page.evaluate(() => window.__toggleGrid?.());
  await expect(page.locator("[data-grid-overlay]")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-grid", "on");
});

test("part 2 furniture is on the plate", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("[data-running-head]")).toContainText(
    "ISAK FORSBERG",
  );
  await expect(page.locator("[data-running-head]")).toContainText("SELECTED WORK");
  await expect(page.locator("[data-folio]")).toHaveText("02 / 07");
  await expect(page.locator("[data-plate-coords]").first()).toContainText(
    "56.0465",
  );
  await expect(page.locator("footer")).toContainText("Deni Anggara");
  await expect(page.locator("footer")).toContainText("Set in Helsingborg, Sweden");
});

test("part 2 portrait is a real halftone", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("[data-halftone]")).toBeVisible();
  await expect(page.getByRole("img", { name: "Isak Forsberg" })).toBeVisible();
});

test("part 2 press filter sits on display type", async ({ page }) => {
  await page.goto("/about");
  const filter = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
    return getComputedStyle(el).filter;
  });
  expect(filter).toMatch(/url\(|press/i);
});

test("part 2 print hides chrome and expands the about cv", async ({ page }) => {
  await page.emulateMedia({ media: "print" });
  await page.goto("/about");
  const hidden = await page.evaluate(() => {
    const chrome = document.querySelector(".site-chrome");
    const grain = document.querySelector(".grain");
    return {
      chrome: chrome ? getComputedStyle(chrome).display : "missing",
      grain: grain ? getComputedStyle(grain).display : "missing",
    };
  });
  expect(hidden.chrome).toBe("none");
  expect(hidden.grain).toBe("none");
  await expect(page.locator(".print-cv")).toBeVisible();
  await expect(page.locator(".print-cv")).toContainText("Strafe.com");
  await expect(page.locator(".print-cv")).toContainText(profileEmail());
});

function profileEmail() {
  return "Isakf999@gmail.com";
}
