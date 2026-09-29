import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * True when the visitor's system asks for reduced motion.
 * Use it to skip JS-driven animation (typing, particles, counters, reveal...).
 * CSS animations are already covered by the global rule in styles/effects.css.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // server snapshot; unused in this client-only app
  );
}
