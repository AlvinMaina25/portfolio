import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { projectCategories } from "../src/content/projectCategories";
import {
  IMAGE_EXTENSIONS,
  formatProblems,
  validateProjects,
  type ProjectProblem,
  type ProjectSource,
} from "../src/lib/projectContent";

/**
 * Fails `vite build` with a readable message when anything in src/content/projects/ is invalid.
 * It reads the folders directly and runs the SAME validation the app runs (src/lib/projectContent.ts),
 * so a broken project can never reach a deployed site. During `npm run dev` the app itself reports
 * the same message in Vite's error overlay, so this plugin only applies to builds.
 *
 * Also catches what the app cannot see: a folder with no project.json (the loader would silently skip it).
 */
export function checkProjectContent(projectsDir: string): string | undefined {
  const problems: ProjectProblem[] = [];
  const sources: ProjectSource[] = [];
  const imagePattern = new RegExp(`\\.(${IMAGE_EXTENSIONS.join("|")})$`, "i");

  if (!fs.existsSync(projectsDir)) return undefined; // no projects yet: nothing to check

  for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_") || entry.name.startsWith(".")) continue;

    const slug = entry.name;
    const dir = path.join(projectsDir, slug);
    const file = `src/content/projects/${slug}/project.json`;
    const jsonPath = path.join(dir, "project.json");

    if (!fs.existsSync(jsonPath)) {
      problems.push({
        file: `src/content/projects/${slug}/`,
        errors: [
          `This folder has no project.json, so it would be ignored. Add one (copy it from _template), ` +
            `or rename the folder to start with "_" if it is not a project.`,
        ],
      });
      continue;
    }

    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (error) {
      problems.push({
        file,
        errors: [`Not valid JSON: ${(error as Error).message}. Check for a missing comma, quote or bracket.`],
      });
      continue;
    }

    const images: Record<string, string> = {};
    const imagesDir = path.join(dir, "images");
    if (fs.existsSync(imagesDir)) {
      for (const name of fs.readdirSync(imagesDir)) if (imagePattern.test(name)) images[name] = name;
    }
    sources.push({ slug, file, raw, images });
  }

  problems.push(...validateProjects(sources, projectCategories).problems);
  return problems.length > 0 ? formatProblems(problems) : undefined;
}

export default function projectContentPlugin(projectsDir: string): Plugin {
  let isBuild = false;

  return {
    name: "project-content-check",

    configResolved(config) {
      isBuild = config.command === "build";
    },

    // `vite build`: stop with the message, so a broken project can never be deployed.
    buildStart() {
      if (!isBuild) return;
      const message = checkProjectContent(projectsDir);
      if (message) this.error(message);
    },

    // `vite` (dev): never crash the server. Print the message in the terminal and show it in the
    // browser's error overlay, and re-check whenever a project file is added, changed or removed.
    configureServer(server) {
      const report = () => {
        const message = checkProjectContent(projectsDir);
        if (!message) return;
        server.config.logger.error(`\n${message}\n`);
        server.ws.send({ type: "error", err: { message, stack: "", plugin: "project-content-check" } });
      };

      server.watcher.add(projectsDir);
      const onFileEvent = (file: string) => {
        if (file.startsWith(projectsDir)) report();
      };
      server.watcher.on("add", onFileEvent);
      server.watcher.on("change", onFileEvent);
      server.watcher.on("unlink", onFileEvent);
      server.ws.on("connection", report);

      report();
    },
  };
}
