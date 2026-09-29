import { useEffect, useState, type ElementType, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { useLoaderReady } from "@/hooks/useLoaderReady";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./Reveal.module.css";

interface RevealProps {
  /** Which way the content slides in from. */
  direction?: "up" | "left" | "right";
  /** Milliseconds to wait once visible. Use staggerDelay(index) for lists. */
  delay?: number;
  /** HTML element to render (use "li" inside a <ul>). Defaults to "div". */
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * Fades and slides its children in the first time they scroll into view.
 * Visitors who prefer reduced motion just see the content, no movement.
 */
export default function Reveal({
  direction = "up",
  delay = 0,
  as: Tag = "div",
  className,
  children,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  // Don't start while the loading screen still covers the page.
  const loaderReady = useLoaderReady();
  // Same trigger point as the legacy site: 10% visible, 50px above the bottom edge.
  const { ref, inView } = useInView<HTMLElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView || !loaderReady || revealed) return;
    const timer = window.setTimeout(() => setRevealed(true), delay);
    return () => window.clearTimeout(timer);
  }, [inView, loaderReady, delay, revealed]);

  const visible = reducedMotion || revealed;

  return (
    <Tag ref={ref} className={cn(styles.reveal, styles[direction], visible && styles.visible, className)}>
      {children}
    </Tag>
  );
}
