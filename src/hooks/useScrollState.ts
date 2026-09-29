import { useEffect, useState } from "react";

export interface ScrollState {
  /** True once the page has scrolled past `scrolledAfter` pixels. */
  scrolled: boolean;
  /** 0 at the top of the page, 1 at the bottom. */
  progress: number;
}

/**
 * The single passive scroll listener for page-wide scroll state, throttled with
 * requestAnimationFrame. `useScrollProgress` and `useScrolled` are thin views on it.
 * State only changes when the value really changes, so scrolling within a stable
 * state causes no re-render.
 */
function readState(scrolledAfter: number): ScrollState {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  return { scrolled: window.scrollY > scrolledAfter, progress };
}

export function useScrollState(scrolledAfter = 50): ScrollState {
  const [state, setState] = useState<ScrollState>(() => readState(scrolledAfter));

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const next = readState(scrolledAfter);
      // Round progress so tiny scroll movements don't re-render on every pixel.
      const rounded = Math.round(next.progress * 1000) / 1000;
      setState((prev) =>
        prev.scrolled === next.scrolled && prev.progress === rounded
          ? prev
          : { scrolled: next.scrolled, progress: rounded },
      );
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrolledAfter]);

  return state;
}
