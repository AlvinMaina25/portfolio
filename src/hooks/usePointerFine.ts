import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * True when the primary input is a precise, hovering pointer (mouse, trackpad).
 * False on phones and tablets. Gate every desktop-only effect on this
 * (custom cursor, card tilt) so touch devices never run them.
 */
export function usePointerFine(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
