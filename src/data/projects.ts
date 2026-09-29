import { projectCategories } from "@/content/projectCategories";
import { buildProjects, sourcesFromGlob } from "@/lib/projectContent";

/**
 * THE SINGLE SOURCE OF TRUTH FOR PROJECTS, and you never edit this file to add one.
 *
 * Every folder in src/content/projects/ that contains a project.json is discovered by the two
 * import.meta.glob calls below (Vite resolves them at build time, so a new folder is picked up
 * automatically, including while `npm run dev` is running). Folders whose name starts with "_"
 * (such as _template) are ignored.
 *
 * The raw content is validated by src/lib/projectContent.ts. A mistake in a project.json makes
 * this module throw a readable message (shown as the error overlay in dev, and it fails
 * `npm run build` too via tools/projectContentPlugin.ts) instead of breaking the page silently.
 *
 * How to add a project: see ADDING_A_PROJECT.md.
 */

// Keep these image extensions in sync with IMAGE_EXTENSIONS in src/lib/projectContent.ts.
const jsonModules = import.meta.glob<unknown>(
  ["/src/content/projects/*/project.json", "!/src/content/projects/_*/**"],
  { eager: true, import: "default" },
);

// "?url" gives each image its final (hashed, base-path-aware) URL, so production paths just work.
const imageUrls = import.meta.glob<string>(
  ["/src/content/projects/*/images/*.{webp,avif,png,jpg,jpeg,gif,svg}", "!/src/content/projects/_*/**"],
  { eager: true, query: "?url", import: "default" },
);

export { projectCategories };

/** All projects, validated and already in display order (see `compareProjects` in src/lib/projectContent.ts). */
export const projects = buildProjects(sourcesFromGlob(jsonModules, imageUrls), projectCategories);
