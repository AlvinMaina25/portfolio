import type { StatItem } from "@/types";
import { useCountUp } from "@/hooks/useCountUp";
import styles from "./HeroSection.module.css";

/** One hero statistic. Counts up once when first seen (a hook can't be called inside a .map, hence its own component). */
export default function HeroStat({ stat }: { stat: StatItem }) {
  const { ref, value } = useCountUp<HTMLElement>(stat.value);
  const suffix = stat.suffix ?? "";

  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>{stat.label}</dt>
      <dd className={styles.statNumber}>
        {/* The moving number is hidden from screen readers; they get the final value once. */}
        <span ref={ref} aria-hidden="true">
          {value}
          {suffix}
        </span>
        <span className={styles.srOnly}>
          {stat.value}
          {suffix}
        </span>
      </dd>
    </div>
  );
}
