import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("phase 2 home mounts the birch plate and keeps type readable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Isak",
  );
  await expect(page.locator("[data-hero-video]")).toHaveCount(1);
  await expect(page.locator("[data-home-arrival]")).toHaveCount(1);

  await page.waitForSelector('video[data-hero-loop="a"]', { timeout: 8000 });
  await expect(page.locator("video[data-hero-loop]")).toHaveCount(2);
  await page.waitForFunction(() => {
    const video = document.querySelector(
      'video[data-hero-loop="a"]',
    ) as HTMLVideoElement | null;
    return Boolean(video && !video.paused && video.currentTime > 0.15);
  });

  const rate = await page.locator('video[data-hero-loop="a"]').evaluate((el) => {
    return (el as HTMLVideoElement).playbackRate;
  });
  expect(rate).toBeGreaterThanOrEqual(0.9);
  expect(rate).toBeLessThanOrEqual(1.08);

  await page.screenshot({
    path: "tests/baselines/phase2-home-1440.png",
    fullPage: false,
  });
});

test("phase 2 interior routes do not mount the forest video", async ({
  page,
}) => {
  await page.goto("/work");
  await expect(page.locator("[data-hero-video]")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});

test("phase 2 reduced motion keeps the poster and skips the decoder", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-hero-video]")).toHaveCount(1);
  await page.waitForTimeout(900);
  await expect(page.locator("video")).toHaveCount(0);
  await page.screenshot({
    path: "tests/baselines/phase2-home-reduced.png",
    fullPage: false,
  });
});

test("phase 2 served birch loop stays under the encode budget", async () => {
  const mp4 = fs.statSync(
    path.join(process.cwd(), "public/media/hero-forest.mp4"),
  ).size;
  expect(mp4).toBeLessThanOrEqual(2.3 * 1024 * 1024);

  const webmPath = path.join(process.cwd(), "public/media/hero-forest.webm");
  if (fs.existsSync(webmPath)) {
    expect(fs.statSync(webmPath).size).toBeLessThanOrEqual(2.3 * 1024 * 1024);
  }
});
