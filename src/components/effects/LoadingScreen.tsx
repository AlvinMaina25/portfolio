import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./LoadingScreen.module.css";

/** Status lines from the legacy loader; one every 400ms. */
const MESSAGES = [
  "INITIALIZING SYSTEMS...",
  "LOADING SECURITY MODULES...",
  "ESTABLISHING SECURE CONNECTION...",
  "DECRYPTING PORTFOLIO DATA...",
  "READY.",
];
const MESSAGE_INTERVAL = 400;
/** Shortest time the screen is shown (legacy: about 2.2s), so it never just flashes. */
const MIN_DURATION = 2200;
/** The screen ALWAYS goes away by this time, even if the page's load event never fires. */
const MAX_DURATION = 4000;
const REDUCED_DURATION = 500;
const FADE_MS = 600;

interface LoadingScreenProps {
  /** Two-letter mark in the hexagon. */
  initials: string;
  /** Called once, the moment the screen starts leaving (however it was triggered). */
  onLeave?: () => void;
}

/**
 * Startup overlay. It sits on top of the already-rendered page (nothing is delayed or
 * hidden behind it), fades out once the minimum time has passed and the window has loaded,
 * and is removed from the DOM afterwards. Any key press or click skips it, and a hard
 * timeout guarantees it can never stay up. Reduced motion: a short, still overlay.
 */
export default function LoadingScreen({ initials, onLeave }: LoadingScreenProps) {
  const reducedMotion = useReducedMotion();
  const loaderRef = useRef<HTMLDivElement>(null);
  // Latest callback without restarting the timers below whenever the parent re-renders.
  const onLeaveRef = useRef(onLeave);
  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  // Decide when to leave.
  useEffect(() => {
    const timers: number[] = [];
    let minPassed = false;
    let leaveCalled = false;

    // While the overlay is up, the page behind it is `inert`: keyboard focus (and screen readers)
    // cannot reach links and buttons the visitor can't see. It is released the moment the
    // loader starts leaving, so the very first Tab that skips it already lands on the page.
    const parent = loaderRef.current?.parentElement;
    const covered: Element[] = parent
      ? Array.from(parent.children).filter((el) => el !== loaderRef.current)
      : [];
    covered.forEach((el) => el.setAttribute("inert", ""));
    const release = () => covered.forEach((el) => el.removeAttribute("inert"));

    const leave = () => {
      if (leaveCalled) return;
      leaveCalled = true;
      release();
      onLeaveRef.current?.();
      setLeaving(true);
      // Fallback in case the CSS transition never reports its end.
      timers.push(window.setTimeout(() => setGone(true), FADE_MS + 200));
    };

    const min = reducedMotion ? REDUCED_DURATION : MIN_DURATION;
    const tryLeave = () => {
      if (minPassed && document.readyState === "complete") leave();
    };

    timers.push(window.setTimeout(() => { minPassed = true; tryLeave(); }, min));
    timers.push(window.setTimeout(leave, Math.max(MAX_DURATION, min)));
    window.addEventListener("load", tryLeave);

    const skip = () => leave();
    // A lone modifier press (Shift, Ctrl...) is not "a key press": screen-reader and shortcut users hit those.
    const skipOnKey = (event: KeyboardEvent) => {
      if (["Shift", "Control", "Alt", "Meta", "AltGraph", "CapsLock"].includes(event.key)) return;
      leave();
    };
    window.addEventListener("keydown", skipOnKey);
    window.addEventListener("pointerdown", skip);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", tryLeave);
      window.removeEventListener("keydown", skipOnKey);
      window.removeEventListener("pointerdown", skip);
      release();
    };
  }, [reducedMotion]);

  // Cycle the status text (skipped with reduced motion: the text just says READY).
  useEffect(() => {
    if (reducedMotion || leaving) return;
    if (messageIndex >= MESSAGES.length - 1) return;
    const timer = window.setTimeout(() => setMessageIndex((i) => i + 1), MESSAGE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [messageIndex, reducedMotion, leaving]);

  if (gone) return null;

  const text = reducedMotion ? "LOADING..." : MESSAGES[messageIndex];

  return (
    <div
      ref={loaderRef}
      className={styles.loader}
      data-leaving={leaving || undefined}
      role="status"
      aria-label="Loading portfolio"
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && leaving) setGone(true);
      }}
    >
      <div className={styles.inner}>
        <div className={styles.hex} aria-hidden="true">
          <svg viewBox="0 0 100 100" className={styles.hexSvg}>
            <polygon points="50,3 97,27.5 97,72.5 50,97 3,72.5 3,27.5" className={styles.hexShape} />
          </svg>
          <span className={styles.initials}>{initials}</span>
        </div>
        <div className={styles.barWrap} aria-hidden="true">
          <div className={styles.bar} />
        </div>
        {/* The decorative status text is hidden from screen readers; the role="status" label above is enough. */}
        <p className={styles.text} aria-hidden="true">
          {text}
        </p>
      </div>
    </div>
  );
}
