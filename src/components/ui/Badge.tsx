import type { ReactNode } from "react";
import type { Tone } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./Badge.module.css";

interface BadgeProps {
  /** Accent color. Leave out for the neutral grey chip. */
  tone?: Tone;
  /**
   * tag   = small chip for technologies, skills, resources ("Python")
   * label = uppercase category/status label ("SECURITY", "COMPLETED")
   */
  variant?: "tag" | "label";
  /** sm = 10-11px (default), md = status badges such as certifications. */
  size?: "sm" | "md";
  /** Decorative symbol before the text. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A small pill of text. Renders a <span>; put several inside a <ul> when they form a list. */
export default function Badge({
  tone,
  variant = "tag",
  size = "sm",
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      data-tone={tone}
      className={cn(styles.badge, styles[variant], styles[size], tone && styles.toned, className)}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
