import { useScrollState } from "./useScrollState";

/** How far down the page the visitor is: 0 (top) to 1 (bottom). */
export function useScrollProgress(): number {
  return useScrollState().progress;
}
