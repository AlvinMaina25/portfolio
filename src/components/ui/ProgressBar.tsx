import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  /** 0-100. Values outside the range are clamped. */
  value: number;
  /** What the bar measures, for screen readers: "Cybersecurity proficiency". */
  label: string;
  /** Also print "65%" beside the bar (used by the learning cards). */
  showValue?: boolean;
  /** sm = 3px (skills), md = 4px (learning). */
  size?: "sm" | "md";
  className?: string;
}

/** A thin gradient bar that fills up the first time it scrolls into view. */
export default function ProgressBar({
  value,
  label,
  showValue = false,
  size = "sm",
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!inView || filled) return;
    // Legacy: a 100ms pause so the CSS transition visibly starts from 0.
    const timer = window.setTimeout(() => setFilled(true), 100);
    return () => window.clearTimeout(timer);
  }, [inView, filled]);

  const shown = reducedMotion || filled;

  return (
    <div ref={ref} className={cn(styles.wrapper, className)}>
      <div
        className={cn(styles.track, styles[size])}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className={styles.fill} style={{ width: shown ? `${percent}%` : "0%" }} />
      </div>
      {showValue && (
        // The number is already exposed by the progressbar role; hide the duplicate.
        <span className={styles.value} aria-hidden="true">
          {percent}%
        </span>
      )}
    </div>
  );
}
