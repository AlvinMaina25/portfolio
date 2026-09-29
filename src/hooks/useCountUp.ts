import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import { useLoaderReady } from "./useLoaderReady";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Counts from 0 up to `target` the first time the element is in view (and the loading screen has
 * left), then stays
 * there (it never restarts). Attach `ref` to the element that shows the number.
 * With reduced motion the final value is returned immediately.
 *
 *   const { ref, value } = useCountUp<HTMLElement>(15);
 */
export function useCountUp<T extends Element = HTMLElement>(target: number, duration = 1500) {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<T>({ threshold: 0.1 });
  const loaderReady = useLoaderReady(); // wait until the loading screen has gone
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reducedMotion || !inView || !loaderReady) return;
    let frame = 0;
    let start: number | undefined;

    const tick = (now: number) => {
      start ??= now;
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * t));
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, loaderReady, reducedMotion, target, duration]);

  return { ref, value: reducedMotion ? target : value };
}
