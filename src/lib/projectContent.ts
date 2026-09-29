/**
 * Turns the raw contents of src/content/projects/<slug>/ into validated `Project` objects.
 *
 * This file is deliberately PURE: no Vite APIs, no DOM, no Node APIs, only relative type imports.
 * That lets two callers share exactly one set of rules:
 *   - src/data/projects.ts        (the browser app: throws on bad content, so dev shows an error overlay)
 *   - tools/projectContentPlugin  (`vite build`: fails the build with the same messages)
 *
 * Nothing here needs editing when you add a project. Read ADDING_A_PROJECT.md instead.
 */
import type { CategoryDefinition, IconName, Project, ProjectStatus, Screenshot } from "../types";

/** Image file types recognised in a project's images/ folder. Keep in sync with the globs in src/data/projects.ts. */
export const IMAGE_EXTENSIONS = ["webp", "avif", "png", "jpg", "jpeg", "gif", "svg"] as const;

const PROJECT_STATUSES: readonly ProjectStatus[] = ["completed", "in-progress", "archived"];

/** Placeholder artwork names a project may pick with "icon". */
const PROJECT_ARTWORK: readonly IconName[] = ["art-app", "art-ai", "art-security", "art-data", "art-cloud"];

/** Folder names: lowercase words joined by hyphens ("my-new-project"). */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ALLOWED_FIELDS = [
  "title",
  "description",
  "category",
  "technologies",
  "badge",
  "status",
  "featured",
  "order",
  "githubUrl",
  "liveUrl",
  "liveLabel",
  "coverImage",
  "coverAlt",
  "icon",
  "screenshots",
  "longDescription",
  "features",
  "challenges",
  "solution",
  "results",
];

/** What the loader collects for one project folder. */
export interface ProjectSource {
  /** Folder name. Becomes the project's id and slug. */
  slug: string;
  /** Path shown in error messages. */
  file: string;
  /** Parsed contents of project.json (untrusted). */
  raw: unknown;
  /** Files in the project's images/ folder: file name -> URL the browser can load. */
  images: Record<string, string>;
}

export interface ProjectProblem {
  file: string;
  errors: string[];
}

/* ── glob results -> sources ──────────────────────────────── */

/**
 * Groups the results of the two import.meta.glob calls in src/data/projects.ts by project folder.
 * Keys look like "/src/content/projects/<slug>/project.json" and ".../<slug>/images/<file>".
 */
export function sourcesFromGlob(
  jsonModules: Record<string, unknown>,
  imageUrls: Record<string, string>,
): ProjectSource[] {
  const sources = new Map<string, ProjectSource>();

  for (const [key, raw] of Object.entries(jsonModules)) {
    const match = /^\/src\/content\/projects\/([^/]+)\/project\.json$/.exec(key);
    if (!match) continue;
    const slug = match[1];
    sources.set(slug, { slug, file: `src/content/projects/${slug}/project.json`, raw, images: {} });
  }

  for (const [key, url] of Object.entries(imageUrls)) {
    const match = /^\/src\/content\/projects\/([^/]+)\/images\/([^/]+)$/.exec(key);
    const source = match ? sources.get(match[1]) : undefined;
    if (match && source) source.images[match[2]] = url;
  }

  return [...sources.values()];
}

/* ── small field readers ──────────────────────────────────── */

type Raw = Record<string, unknown>;

function isRecord(value: unknown): value is Raw {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Optional text field. Empty text counts as "not set". */
function readText(raw: Raw, key: string, errors: string[]): string | undefined {
  const value = raw[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    errors.push(`"${key}" must be text (in quotes).`);
    return undefined;
  }
  return value.trim() || undefined;
}

function requireText(raw: Raw, key: string, errors: string[]): string | undefined {
  const before = errors.length;
  const value = readText(raw, key, errors);
  // Missing or empty -> say so (a wrong type has already been reported by readText).
  if (value === undefined && errors.length === before) {
    errors.push(`"${key}" is required (a non-empty piece of text).`);
  }
  return value;
}

/** A list of non-empty texts. Empty/missing list counts as "not set". */
function readTextList(raw: Raw, key: string, errors: string[]): string[] | undefined {
  const value = raw[key];
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push(`"${key}" must be a list of non-empty texts, e.g. ["one", "two"].`);
    return undefined;
  }
  const list = value.map((item: string) => item.trim());
  return list.length > 0 ? list : undefined;
}

function readUrl(raw: Raw, key: "githubUrl" | "liveUrl", errors: string[]): string | undefined {
  const value = readText(raw, key, errors);
  if (!value) return undefined;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    errors.push(`"${key}" is not a valid web address: "${value}". It must start with https://`);
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    errors.push(`"${key}" must start with https:// (got "${value}").`);
    return undefined;
  }
  if (key === "githubUrl") {
    const isGitHub = url.hostname === "github.com" || url.hostname === "www.github.com";
    const parts = url.pathname.split("/").filter(Boolean);
    if (!isGitHub || parts.length < 2) {
      errors.push(
        `"githubUrl" must point to a repository, like https://github.com/your-name/repo-name (got "${value}"). ` +
          `Leave it out if there is no public repository.`,
      );
      return undefined;
    }
  }
  return value;
}

/** Comparison key so "Full-Stack", "Full Stack" and "fullstack" all match. */
function normalizeKey(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Finds an image by the name written in project.json ("cover.webp", "./images/cover.webp"). */
function findImage(reference: string, images: Record<string, string>): string | undefined {
  const name = reference.trim().replace(/^\.\//, "").replace(/^images\//, "");
  return Object.hasOwn(images, name) ? images[name] : undefined;
}

function imageNotFound(field: string, reference: string, images: Record<string, string>): string {
  const names = Object.keys(images);
  const name = reference.trim().replace(/^\.\//, "").replace(/^images\//, "");
  const sameIgnoringCase = names.find((n) => n.toLowerCase() === name.toLowerCase());
  const hint = sameIgnoringCase
    ? ` Did you mean "${sameIgnoringCase}"? File names are case-sensitive.`
    : names.length > 0
      ? ` Files in images/: ${names.join(", ")}.`
      : ` The images/ folder has no images yet.`;
  return `"${field}" refers to "${reference}", but that file is not in this project's images/ folder.${hint}`;
}

/* ── one project ──────────────────────────────────────────── */

export function parseProject(
  source: ProjectSource,
  categories: readonly CategoryDefinition[],
): { project?: Project; errors: string[] } {
  const { slug, raw, images } = source;
  const errors: string[] = [];

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(`The folder name "${slug}" must be lowercase words joined by hyphens, like "my-new-project".`);
  }
  if (!isRecord(raw)) {
    return { errors: [...errors, "project.json must contain a JSON object: { ... }"] };
  }

  // Typos like "tittle" or "technologes" are the most likely mistake; catch them instead of ignoring them.
  // Keys starting with "_" are allowed as comments (JSON has no comments).
  for (const key of Object.keys(raw)) {
    if (!key.startsWith("_") && !ALLOWED_FIELDS.includes(key)) {
      errors.push(`Unknown field "${key}". Check the spelling. Allowed fields: ${ALLOWED_FIELDS.join(", ")}.`);
    }
  }

  // Required
  const title = requireText(raw, "title", errors);
  const description = requireText(raw, "description", errors);
  const categoryText = requireText(raw, "category", errors);
  const errorsBeforeTechnologies = errors.length;
  const technologies = readTextList(raw, "technologies", errors);
  if (!technologies && errors.length === errorsBeforeTechnologies) {
    errors.push(`"technologies" is required: a list with at least one item, e.g. ["React", "TypeScript"].`);
  }

  // A copied-but-unedited _template must not reach the site.
  const isPlaceholder = (text: string | undefined) => text !== undefined && /^replace\b/i.test(text);
  for (const [field, value] of [["title", title], ["description", description]] as const) {
    if (isPlaceholder(value)) errors.push(`"${field}" still has the template placeholder text. Replace it with the real ${field}.`);
  }
  if (technologies?.some(isPlaceholder)) errors.push(`"technologies" still has the template placeholder text. Replace it with the real technologies.`);

  let category: CategoryDefinition | undefined;
  if (categoryText) {
    category = categories.find(
      (c) => normalizeKey(c.id) === normalizeKey(categoryText) || normalizeKey(c.label) === normalizeKey(categoryText),
    );
    if (!category) {
      errors.push(
        `"category" is "${categoryText}", which is not a known category. Use one of: ` +
          `${categories.map((c) => `"${c.id}"`).join(", ")} (or add a new one in src/content/projectCategories.ts).`,
      );
    }
  }

  // Optional
  const badge = readText(raw, "badge", errors);
  const liveLabel = readText(raw, "liveLabel", errors);
  const githubUrl = readUrl(raw, "githubUrl", errors);
  const liveUrl = readUrl(raw, "liveUrl", errors);
  const longDescription = readText(raw, "longDescription", errors);
  const solution = readText(raw, "solution", errors);
  const features = readTextList(raw, "features", errors);
  const challenges = readTextList(raw, "challenges", errors);
  const results = readTextList(raw, "results", errors);

  let status: ProjectStatus | undefined;
  const statusText = readText(raw, "status", errors);
  if (statusText) {
    status = PROJECT_STATUSES.find((s) => s === statusText);
    if (!status) errors.push(`"status" is "${statusText}". Use one of: ${PROJECT_STATUSES.map((s) => `"${s}"`).join(", ")}.`);
  }

  let featured: boolean | undefined;
  if (raw.featured !== undefined && raw.featured !== null) {
    if (typeof raw.featured === "boolean") featured = raw.featured;
    else errors.push(`"featured" must be true or false (no quotes).`);
  }

  let order: number | undefined;
  if (raw.order !== undefined && raw.order !== null) {
    if (typeof raw.order === "number" && Number.isFinite(raw.order)) order = raw.order;
    else errors.push(`"order" must be a number (no quotes), e.g. 10.`);
  }

  let icon: IconName | undefined;
  const iconText = readText(raw, "icon", errors);
  if (iconText) {
    icon = PROJECT_ARTWORK.find((name) => name === iconText);
    if (!icon) errors.push(`"icon" is "${iconText}". Use one of: ${PROJECT_ARTWORK.map((n) => `"${n}"`).join(", ")}.`);
  }

  // Cover image: named explicitly, or picked up automatically when the folder has images/cover.<ext>.
  let image: string | undefined;
  const coverReference = readText(raw, "coverImage", errors);
  if (coverReference) {
    image = findImage(coverReference, images);
    if (!image) errors.push(imageNotFound("coverImage", coverReference, images));
  } else {
    const auto = Object.keys(images).find((name) => normalizeKey(name.replace(/\.[^.]+$/, "")) === "cover");
    if (auto) image = images[auto];
  }
  const coverAlt = readText(raw, "coverAlt", errors);

  // Screenshots (stored for the future project pages; not displayed yet)
  let screenshots: Screenshot[] | undefined;
  if (raw.screenshots !== undefined && raw.screenshots !== null) {
    if (!Array.isArray(raw.screenshots)) {
      errors.push(`"screenshots" must be a list: [{ "src": "screenshot-1.webp", "alt": "What it shows" }].`);
    } else {
      const list: Screenshot[] = [];
      raw.screenshots.forEach((entry: unknown, index: number) => {
        const where = `"screenshots" item ${index + 1}`;
        if (!isRecord(entry)) {
          errors.push(`${where} must look like { "src": "screenshot-1.webp", "alt": "What it shows" }.`);
          return;
        }
        const entryErrors: string[] = [];
        const src = readText(entry, "src", entryErrors);
        const alt = readText(entry, "alt", entryErrors);
        if (!src) entryErrors.push(`"src" is required`);
        if (!alt) entryErrors.push(`"alt" is required (describe what the screenshot shows, for screen readers)`);
        const url = src ? findImage(src, images) : undefined;
        if (src && !url) entryErrors.push(imageNotFound("src", src, images).replace(/^"src" /, "the file "));
        if (entryErrors.length > 0) errors.push(`${where}: ${entryErrors.join("; ")}.`);
        else if (url && alt) list.push({ src: url, alt });
      });
      if (list.length > 0) screenshots = list;
    }
  }

  if (errors.length > 0 || !title || !description || !category || !technologies) return { errors };

  const project: Project = {
    id: slug,
    slug,
    title,
    description,
    category: category.id,
    technologies,
  };
  if (badge) project.badge = badge;
  if (status) project.status = status;
  if (featured !== undefined) project.featured = featured;
  if (order !== undefined) project.order = order;
  if (githubUrl) project.githubUrl = githubUrl;
  if (liveUrl) project.liveUrl = liveUrl;
  if (liveLabel) project.liveLabel = liveLabel;
  if (image) {
    project.image = image;
    project.imageAlt = coverAlt ?? `Preview of ${title}`;
  }
  const artwork = icon ?? category.icon;
  if (artwork) project.icon = artwork;
  if (screenshots) project.screenshots = screenshots;
  if (longDescription) project.longDescription = longDescription;
  if (features) project.features = features;
  if (challenges) project.challenges = challenges;
  if (solution) project.solution = solution;
  if (results) project.results = results;

  return { project, errors };
}

/* ── the whole collection ─────────────────────────────────── */

/**
 * Display order, decided by content: lowest `order` first (projects with no `order` come after
 * those that have one), then featured before non-featured, then A to Z by title.
 */
export function compareProjects(a: Project, b: Project): number {
  const orderA = a.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.order ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) return orderA < orderB ? -1 : 1;
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  return a.title.localeCompare(b.title);
}

/** Validates every project and returns the sorted valid ones plus every problem found (never throws). */
export function validateProjects(
  sources: readonly ProjectSource[],
  categories: readonly CategoryDefinition[],
): { projects: Project[]; problems: ProjectProblem[] } {
  const projects: Project[] = [];
  const problems: ProjectProblem[] = [];

  for (const source of sources) {
    const { project, errors } = parseProject(source, categories);
    if (project) projects.push(project);
    if (errors.length > 0) problems.push({ file: source.file, errors });
  }

  return { projects: projects.sort(compareProjects), problems };
}

export function formatProblems(problems: readonly ProjectProblem[]): string {
  const body = problems
    .map(({ file, errors }) => `${file}\n${errors.map((error) => `  - ${error}`).join("\n")}`)
    .join("\n\n");
  return `Invalid project content. Fix the following and try again:\n\n${body}\n\n(See ADDING_A_PROJECT.md.)`;
}

/** Validated, sorted projects, or a thrown Error listing every problem at once. */
export function buildProjects(sources: readonly ProjectSource[], categories: readonly CategoryDefinition[]): Project[] {
  const { projects, problems } = validateProjects(sources, categories);
  if (problems.length > 0) throw new Error(formatProblems(problems));
  return projects;
}
