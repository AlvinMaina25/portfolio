import type { ReactNode } from "react";
import type { IconName } from "@/types";
import { GITHUB_PATH, LINKEDIN_PATH, WHATSAPP_PATH, X_PATH } from "./iconPaths";

/** How one icon is drawn. `stroke` icons are outlines, `fill` icons are solid shapes. */
interface IconDefinition {
  viewBox: string;
  style: "stroke" | "fill";
  strokeWidth?: number;
  shapes: ReactNode;
}

/*
 * Every legacy icon, drawn exactly as in legacy/index.html.
 * Typed as Record<IconName, ...>, so adding a name to IconName without drawing it here is a compile error.
 * Icons inherit their color from CSS `color` (they use currentColor).
 */
const icons: Record<IconName, IconDefinition> = {
  // ── concepts (24x24 outline) ──
  shield: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  "shield-check": {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  ai: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </>
    ),
  },
  globe: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      </>
    ),
  },
  smartphone: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </>
    ),
  },
  cloud: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
  },
  "cloud-upload": {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <path d="M12 13v4M10 15l2-2 2 2" />
      </>
    ),
  },
  code: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  "bar-chart": {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
  },
  network: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M12 13v3" />
      </>
    ),
  },
  cube: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    ),
  },
  monitor: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },

  // ── placeholder artwork (60x60, thin outline) ──
  "art-app": {
    viewBox: "0 0 60 60", style: "stroke", strokeWidth: 1,
    shapes: (
      <>
        <rect x="5" y="15" width="50" height="35" rx="3" />
        <path d="M20 15V10M30 15V5M40 15V10" />
        <path d="M5 25h50" />
      </>
    ),
  },
  "art-ai": {
    viewBox: "0 0 60 60", style: "stroke", strokeWidth: 1,
    shapes: (
      <>
        <circle cx="30" cy="30" r="20" />
        <circle cx="30" cy="30" r="8" />
        <line x1="30" y1="10" x2="30" y2="22" />
        <line x1="30" y1="38" x2="30" y2="50" />
        <line x1="10" y1="30" x2="22" y2="30" />
        <line x1="38" y1="30" x2="50" y2="30" />
      </>
    ),
  },
  "art-security": {
    viewBox: "0 0 60 60", style: "stroke", strokeWidth: 1,
    shapes: (
      <>
        <path d="M30 5L10 15v15c0 13 9 22 20 25 11-3 20-12 20-25V15z" />
        <path d="M20 30l6 6 14-14" />
      </>
    ),
  },
  "art-data": {
    viewBox: "0 0 60 60", style: "stroke", strokeWidth: 1,
    shapes: (
      <>
        <rect x="5" y="5" width="50" height="50" rx="2" />
        <line x1="5" y1="20" x2="55" y2="20" />
        <line x1="20" y1="20" x2="20" y2="55" />
        <polyline points="25,45 32,30 40,38 48,25" />
      </>
    ),
  },
  "art-cloud": {
    viewBox: "0 0 60 60", style: "stroke", strokeWidth: 1,
    shapes: <path d="M45 28a15 15 0 1 0-30 0H12a10 10 0 0 0 0 20h36a10 10 0 0 0 0-20z" />,
  },

  // ── brands and contact ──
  github: { viewBox: "0 0 24 24", style: "fill", shapes: <path d={GITHUB_PATH} /> },
  linkedin: { viewBox: "0 0 24 24", style: "fill", shapes: <path d={LINKEDIN_PATH} /> },
  x: { viewBox: "0 0 24 24", style: "fill", shapes: <path d={X_PATH} /> },
  whatsapp: { viewBox: "0 0 24 24", style: "fill", shapes: <path d={WHATSAPP_PATH} /> },
  email: {
    viewBox: "0 0 24 24", style: "fill",
    shapes: (
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.278.075-.53.174-.16l.011.016L12 13.69 23.815 5.3l.01-.015c.1-.123.175-.373.175-.828z" />
    ),
  },
  mail: {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 1.5,
    shapes: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
  },

  // ── interface ──
  "chevron-up": {
    viewBox: "0 0 24 24", style: "stroke", strokeWidth: 2,
    shapes: <polyline points="18 15 12 9 6 15" />,
  },
};

interface IconProps {
  name: IconName;
  /** Width and height. A number means pixels; default "1em" scales with the surrounding text. */
  size?: number | string;
  /**
   * Accessible name. Leave it out when the icon sits next to text or inside a
   * labelled button/link (the normal case): it is then hidden from screen readers.
   */
  title?: string;
  className?: string;
}

/** Draws one of the portfolio's icons. See the `IconName` type for the available names. */
export default function Icon({ name, size = "1em", title, className }: IconProps) {
  const icon = icons[name];
  const isStroke = icon.style === "stroke";

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      className={className}
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? "currentColor" : undefined}
      strokeWidth={isStroke ? icon.strokeWidth : undefined}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {icon.shapes}
    </svg>
  );
}
