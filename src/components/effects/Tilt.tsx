import type { ReactNode } from "react";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";
import styles from "./Tilt.module.css";

interface TiltProps {
  /** Max rotation in degrees. */
  maxTilt?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Wrap any card to give it the mouse-follow 3D tilt. Two elements on purpose: the outer one
 * never moves and listens for the pointer; the inner one is rotated. (If the rotated element
 * were also the pointer target, its edges would slide out from under the cursor and the tilt
 * would flicker on and off along the border.) The card's own hover lift keeps working and
 * links/buttons inside are untouched. Plain wrappers (no tilt) on touch devices and with
 * reduced motion.
 */
export default function Tilt({ maxTilt, className, children }: TiltProps) {
  const ref = useTilt<HTMLDivElement>({ maxTilt });
  return (
    <div ref={ref} className={cn(styles.root, className)}>
      <div className={styles.tilt}>{children}</div>
    </div>
  );
}
