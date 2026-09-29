import type { NavigationItem } from "@/types";

/** Id of the first section. The navbar logo and the footer's back-to-top link point here. */
export const HOME_SECTION_ID = "home";

/**
 * Links shown in the navbar, in page order. Each `id` must match the `id` of the
 * section it points to (see src/pages/Home.tsx) so the active-link highlight can
 * work later. Labels and order carried over from legacy/index.html.
 */
export const navItems: NavigationItem[] = [
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "certifications", label: "Certs", href: "#certifications" },
  { id: "learning", label: "Learning", href: "#learning" },
  { id: "contact", label: "Contact", href: "#contact" },
];
