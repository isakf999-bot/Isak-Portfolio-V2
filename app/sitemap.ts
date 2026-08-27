import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { noteSlugs } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

const routes = [
  "",
  "/work",
  "/experience",
  "/about",
  "/write",
  "/contact",
  "/cv",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
  const surveys = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const notes = noteSlugs().map((slug) => ({
    url: `${siteUrl}/write/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...surveys, ...notes];
}
