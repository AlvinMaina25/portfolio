import type { Accent, FilterOption } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  options: FilterOption[];
  /** id of the currently selected option. */
  value: string;
  onChange: (id: string) => void;
  /** Names the group for screen readers: "Filter projects by category". */
  label: string;
  /** Color of the selected/hovered button. Projects use gold, skills use blue. */
  accent?: Accent;
  className?: string;
}

/**
 * Row of toggle buttons where exactly one is selected. It only reports the choice;
 * the section decides what to filter. Reused by Skills and Projects.
 */
export default function FilterBar({
  options,
  value,
  onChange,
  label,
  accent = "blue",
  className,
}: FilterBarProps) {
  return (
    <div role="group" aria-label={label} className={cn(styles.bar, styles[accent], className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={styles.filter}
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
