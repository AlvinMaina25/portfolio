import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import styles from "./Section.module.css";

interface SectionProps {
  /** Becomes the anchor target (#id) and what the navbar highlights. */
  id: string;
  /** Alternate backgrounds between neighbouring sections, as on the legacy site. */
  background?: "primary" | "secondary";
  /** id of the section's heading element, so screen readers announce the section by name. */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

/** The outer shell shared by every content section: spacing, background, anchor id, Container. */
export default function Section({
  id,
  background = "primary",
  labelledBy,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(styles.section, styles[background], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}
