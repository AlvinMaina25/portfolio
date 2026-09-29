import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** 0-1: how much of the element must be visible. */
  threshold?: number;
  /** Grow/shrink the viewport, e.g. "0px 0px -50px 0px" fires 50px late. */
  rootMargin?: string;
  /** Stop watching after the first time it becomes visible (default true). */
  once?: boolean;
}

/**
 * Tells you when an element scrolls into view. The one building block behind
 * Reveal, ProgressBar and (later) animated counters.
 *
 *   const { ref, inView } = useInView<HTMLDivElement>();
 *   return <div ref={ref}>{inView ? "seen" : "not yet"}</div>;
 */
export function useInView<T extends Element = HTMLElement>({
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  // Without IntersectionObserver (very old browsers) treat everything as visible.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
