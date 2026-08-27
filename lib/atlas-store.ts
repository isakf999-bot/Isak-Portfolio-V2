import type { AtlasClass } from "@/lib/atlas";

export type AtlasFilter = "all" | AtlasClass;
export type AtlasView = "globe" | "list";

export type AtlasSnapshot = {
  filter: AtlasFilter;
  view: AtlasView;
  hover: string | null;
  focus: string | null;
};

let snapshot: AtlasSnapshot = {
  filter: "all",
  view: "list",
  hover: null,
  focus: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getAtlasSnapshot(): AtlasSnapshot {
  return snapshot;
}

export function subscribeAtlas(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAtlasState(partial: Partial<AtlasSnapshot>) {
  snapshot = { ...snapshot, ...partial, view: "list" };
  emit();
}

export function setAtlasFilter(filter: AtlasFilter) {
  setAtlasState({ filter });
}

export function setAtlasView(_view: AtlasView) {
  setAtlasState({ view: "list" });
}

export function setAtlasHover(hover: string | null) {
  setAtlasState({ hover });
}

export function setAtlasFocus(focus: string | null) {
  setAtlasState({ focus, hover: focus ?? snapshot.hover });
}

export function preferListIfNoWebgl() {
  setAtlasView("list");
}

export const ATLAS_FILTERS: { id: AtlasFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commerce", label: "Commerce" },
  { id: "systems", label: "Systems" },
  { id: "landing", label: "Landing" },
];
