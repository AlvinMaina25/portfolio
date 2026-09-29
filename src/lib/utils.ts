/** Join class names, skipping falsy values: cn("card", isActive && "active") */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Delay for staggered reveal animations: the 1st item at 0ms, 2nd at 80ms, ...
 * capped so long lists don't make the last cards wait forever (legacy: 80ms step, 400ms cap).
 */
export function staggerDelay(index: number, step = 80, max = 400): number {
  return Math.min(index * step, max);
}
