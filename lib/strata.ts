import { education, work, type Lithology, type Role } from "@/lib/content";

export type Stratum = Role & {
  index: number;
  y0: number;
  y1: number;
  height: number;
  rock: number;
};

const UNIT = 0.42;
const GAP = 0.06;

const ROCK: Record<Lithology, number> = {
  till: 0,
  granite: 1,
  shale: 2,
};

const ordered: Role[] = [education[0], work[0], education[1]].filter(
  (item): item is Role => Boolean(item),
);

function stack(): Stratum[] {
  let cursor = 0;
  return ordered.map((item, index) => {
    const height = item.months * UNIT;
    const y0 = cursor;
    const y1 = cursor + height;
    cursor = y1 + GAP;
    return {
      ...item,
      index,
      y0,
      y1,
      height,
      rock: ROCK[item.lithology],
    };
  });
}

export const strata: Stratum[] = stack();
export const STRATA_COUNT = strata.length;
export const STRATA_TOP = strata[strata.length - 1]?.y1 ?? 1;
export const STRATA_MONTHS = strata.reduce((sum, item) => sum + item.months, 0);

export function stratumAt(y: number): Stratum {
  let found = strata[strata.length - 1];
  for (const item of strata) {
    if (y >= item.y0 && y <= item.y1 + GAP * 0.5) found = item;
  }
  return found;
}
