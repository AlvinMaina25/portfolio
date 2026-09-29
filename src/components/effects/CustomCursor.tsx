import { useEffect, useRef } from "react";
import { usePointerFine } from "@/hooks/usePointerFine";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./CustomCursor.module.css";

/** Things that make the dot grow and turn gold. */
const HOVER_TARGETS = "a, button, label, summary, [role='button']";
/** Text fields keep the native I-beam, so the custom dot steps aside there. */
const TEXT_TARGETS = "input, textarea, select";
/** Fraction of the remaining distance the glow covers each frame (legacy: 0.1). */
const GLOW_EASE = 0.1;

/**
 * Desktop-only custom cursor: a dot that follows the pointer exactly and a soft glow that
 * follows with lag. Position is written straight to the DOM in a requestAnimationFrame loop
 * that runs only while the glow is still catching up, so there are no React renders on move.
 * Renders nothing on touch devices or with reduced motion (the normal cursor stays).
 */
export default function CustomCursor() {
  const fine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = fine && !reducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!active || !dot || !glow) return;

    const root = document.documentElement;
    root.setAttribute("data-custom-cursor", ""); // hides the native cursor (see styles/effects.css)

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let frame = 0;
    let seen = false;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      glowX += (mouseX - glowX) * GLOW_EASE;
      glowY += (mouseY - glowY) * GLOW_EASE;
      place(glow, glowX, glowY);
      // Keep going until the glow has (almost) reached the pointer, then stop the loop.
      if (Math.abs(mouseX - glowX) > 0.3 || Math.abs(mouseY - glowY) > 0.3) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouseX = event.clientX;
      mouseY = event.clientY;
      place(dot, mouseX, mouseY);
      if (!seen) {
        seen = true;
        glowX = mouseX;
        glowY = mouseY;
        dot.setAttribute("data-visible", "");
        glow.setAttribute("data-visible", "");
      }
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      dot.toggleAttribute("data-hover", target.closest(HOVER_TARGETS) !== null);
      dot.toggleAttribute("data-text", target.closest(TEXT_TARGETS) !== null);
    };

    const onLeaveWindow = () => {
      seen = false;
      dot.removeAttribute("data-visible");
      glow.removeAttribute("data-visible");
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      root.removeAttribute("data-custom-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={glowRef} className={cn(styles.glow)} aria-hidden="true" />
      <div ref={dotRef} className={cn(styles.dot)} aria-hidden="true" />
    </>
  );
}
