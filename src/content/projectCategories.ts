import type { CategoryDefinition } from "../types";

/**
 * The project categories. This is the ONLY place categories are defined; project.json files just
 * name one (by id or label, e.g. "fullstack" or "Full Stack"). Filter buttons in the Projects
 * section are built from this list, and only categories that have at least one project appear.
 *
 * To add a brand-new category, add one line here. Adding a project to an existing category
 * needs no change here.
 *
 * `icon` is the placeholder artwork a card shows when a project has no cover image.
 *
 * This file must stay dependency-free (relative imports, types only): the build-time content
 * check in tools/projectContentPlugin.ts imports it too.
 */
export const projectCategories: CategoryDefinition[] = [
  { id: "security", label: "Security", tone: "red", icon: "art-security" },
  { id: "ai", label: "AI / ML", tone: "blue", icon: "art-ai" },
  { id: "fullstack", label: "Full Stack", tone: "sky", icon: "art-app" },
  { id: "cloud", label: "Cloud", tone: "teal", icon: "art-cloud" },
];
