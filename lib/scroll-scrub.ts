import { wind } from "@/lib/wind";

/**
 * Maps scroll through `el` into 0..1.
 * Uses document scroll past the element's top so progress moves as soon as
 * the page scrolls — no dead zone waiting for sticky to pin.
 */
export function bindScrollScrub(
  el: HTMLElement,
  onT: (t: number) => void,
): () => void {
  let current = 0;
  return wind.subscribe(() => {
    const span = Math.max(1, el.offsetHeight - window.innerHeight);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const raw = Math.min(1, Math.max(0, (window.scrollY - top) / span));
    current += (raw - current) * 0.22;
    onT(current);
  });
}
