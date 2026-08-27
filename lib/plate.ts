import { profile } from "@/lib/content";

export const PLATE_COUNT = 7;
export const BUILD_DATE = "21 August 2026";

export type Plate = {
  index: string;
  label: string;
  running: string;
};

const plates: Record<string, Plate> = {
  "/": { index: "01", label: "HOME", running: "THE ATLAS" },
  "/work": { index: "02", label: "WORK", running: "SELECTED WORK" },
  "/experience": { index: "03", label: "EXPERIENCE", running: "FIELD NOTES" },
  "/about": { index: "04", label: "ABOUT", running: "THE PERSON" },
  "/contact": { index: "05", label: "CONTACT", running: "SIGNAL" },
  "/write": { index: "06", label: "WRITE", running: "NOTES" },
  "/cv": { index: "07", label: "CV", running: "CURRICULUM" },
};

export function plateFor(path: string): Plate {
  if (path.startsWith("/work/")) {
    return { index: "02", label: "SURVEY", running: "SURVEY" };
  }
  if (path.startsWith("/write/")) {
    return { index: "06", label: "WRITE", running: "NOTES" };
  }
  return plates[path] ?? { index: "00", label: "PLATE", running: "THE ATLAS" };
}

export function runningHead(path: string): string {
  const plate = plateFor(path);
  return `${profile.name.toUpperCase()} · ${plate.running} · 2026`;
}

export function folio(path: string): string {
  return `${plateFor(path).index} / ${String(PLATE_COUNT).padStart(2, "0")}`;
}

export const plateCoords = `${profile.lat} · ${profile.lon}`;
