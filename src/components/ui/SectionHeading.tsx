import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  /** Section number shown as "// 01". Omit to hide the tag. */
  number?: number;
  title: string;
  /** id for the <h2>; pass the same value to Section's `labelledBy`. */
  id?: string;
  className?: string;
}

/** The "// 01  Title  ——" block that opens each section. Renders an <h2>. */
export default function SectionHeading({ number, title, id, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn(styles.heading, className)}>
      {number !== undefined && (
        // Decorative numbering; read aloud it would just be noise.
        <span className={styles.tag} aria-hidden="true">
          {`// ${String(number).padStart(2, "0")}`}
        </span>
      )}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      <div className={styles.line} aria-hidden="true" />
    </Reveal>
  );
}
