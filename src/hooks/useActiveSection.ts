import { useEffect, useState } from "react";

/**
 * Which section is currently "active" while scrolling. Uses one IntersectionObserver
 * (no scroll listener): a section becomes active when it crosses a thin band placed
 * a little below the navbar. Sections are looked up by id, so this stays in step
 * with src/data/navigation.ts and the ids set by each Section.
 *
 * Returns undefined until a section is active. A short last section that can never reach
 * the band is handled by the caller (PageLayout) using the scroll progress.
 */
export function useActiveSection(sectionIds: readonly string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  // A stable key so a new array with the same ids doesn't rebuild the observer.
  const key = sectionIds.join("|");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = key ? key.split("|") : [];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // Active band: from 30% down the viewport to 40% up from the bottom (roughly the middle).
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [key]);

  return activeId;
}
