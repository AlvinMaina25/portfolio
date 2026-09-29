import type { ElementType, ReactNode } from "react";
import type { Accent } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./Card.module.css";

interface CardProps {
  /** HTML element to render: "article" for standalone items, "li" inside a list. Defaults to "div". */
  as?: ElementType;
  /** Color of the hover border/glow: blue (skills, certs, learning) or gold (projects). */
  accent?: Accent;
  /** none = edge-to-edge content such as a card image, md = padded (default). */
  padding?: "none" | "md";
  /** Lift and glow on hover. Turn off for cards that are not interactive. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * The glass panel behind skills, projects, certifications and learning items.
 * Section-specific layout goes in the section's own CSS, passed via className.
 * To change how far a card lifts on hover, set --card-lift on it (default -5px).
 */
export default function Card({
  as: Tag = "div",
  accent = "blue",
  padding = "md",
  interactive = true,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        styles.card,
        styles[accent],
        padding === "md" && styles.padded,
        interactive && styles.interactive,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
