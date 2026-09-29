import { useEffect, useRef } from "react";
import { usePointerFine } from "./usePointerFine";
import { useReducedMotion } from "./useReducedMotion";

interface TiltOptions {
  /** Maximum rotation in degrees at the card's edge (legacy: 4). */
  maxTilt?: number;
}

/**
 * Tilts an element toward the mouse. It only sets two CSS variables (--tilt-x, --tilt-y)
 * on the element; the transform and its smoothing live in Tilt.module.css, so React never
 * re-renders while the pointer moves. Does nothing on touch devices or with reduced motion.
 * The move listener exists only while the pointer is over the element.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({ maxTilt = 4 }: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const fine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const enabled = fine && !reducedMotion;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;

    const reset = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
      el.removeAttribute("data-tilting");
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || frame) return;
      const { clientX, clientY } = event;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        const py = (clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--tilt-x", `${(-py * 2 * maxTilt).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${(px * 2 * maxTilt).toFixed(2)}deg`);
      });
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      el.setAttribute("data-tilting", "");
      el.addEventListener("pointermove", onMove, { passive: true });
    };
    const onLeave = () => {
      el.removeEventListener("pointermove", onMove);
      reset();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
      reset();
    };
  }, [enabled, maxTilt]);

  return ref;
}
