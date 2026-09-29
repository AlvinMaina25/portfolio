# Adding a project to the portfolio

**You never edit React code to add a project.** You add a folder. The site finds it by itself.

## The 60-second version

1. Copy the template folder and give the copy your project's name:

   ```bash
   cp -r src/content/projects/_template src/content/projects/my-new-project
   ```

   (Or copy/paste the folder in your file explorer.) The name must be **lowercase words joined by hyphens**: `my-new-project`, `auto-cars`, `lead-hunter`. It becomes the project's permanent ID, so pick something you won't want to change.

2. Open `src/content/projects/my-new-project/project.json` and edit it (see the fields below). Delete the lines you don't need.

3. Drop your images into `src/content/projects/my-new-project/images/`. Name the main one `cover.webp` (or `.png` / `.jpg`) and it is used as the card image automatically.

4. Run the site and look at it:

   ```bash
   npm run dev
   ```

   The project appears in the **Projects** section as soon as you save. Nothing else to register.

That's it. `_template` is never shown on the site; it exists only to be copied.

## What the folder looks like

```text
src/content/projects/
  _template/                <- copy this. Ignored by the site (names starting with "_" are ignored)
  kingdom-app/
    project.json            <- the project's information (required)
    images/
      cover.webp            <- card image (optional, found automatically)
      screenshot-1.webp     <- extra screenshots (optional)
  my-new-project/           <- your new folder
    project.json
    images/
```

## The fields in `project.json`

**Required** (the build fails without them):

| Field | What to write | Example |
| --- | --- | --- |
| `title` | Project name. | `"Auto Cars"` |
| `description` | 1-2 factual sentences: what it is, what you can do with it, what it is built with. Only claims that are true. | `"A car listing site with search and filters, built with React and Node.js."` |
| `category` | One of the categories below. | `"fullstack"` |
| `technologies` | List of real technologies used. | `["React", "TypeScript", "Node.js"]` |

**Optional** (leave out or delete what you don't have):

| Field | What it does | Example |
| --- | --- | --- |
| `githubUrl` | Repository link. Must be a real repo (`https://github.com/name/repo`). No repo? Leave it out and no GitHub button appears. | `"https://github.com/AlvinMaina25/auto-cars"` |
| `liveUrl` | Link to the working deployment. Only add it if it really works. Leave it out and no demo button appears. | `"https://auto-cars.netlify.app"` |
| `liveLabel` | Text on the live button. Default is "Live Demo". | `"Case Study"` |
| `coverImage` | Only needed if your cover isn't named `cover.*`. File name inside `images/`. | `"main.webp"` |
| `coverAlt` | Describes the cover image for screen readers. Please add one when you have a cover. | `"Search results page"` |
| `featured` | `true` puts it ahead of non-featured projects that have the same `order` (or no `order`). | `true` |
| `order` | A number. **Lower comes first.** Controls the order of the cards. Projects without an `order` come after those that have one. | `10` |
| `status` | `"completed"`, `"in-progress"` or `"archived"`. Stored for later; not shown on the site yet. | `"in-progress"` |
| `badge` | Overrides the category name on the card's label. | `"Data Science"` |
| `icon` | Placeholder artwork when there is no cover image: `art-app`, `art-ai`, `art-security`, `art-data`, `art-cloud`. Default comes from the category. | `"art-data"` |
| `screenshots` | List of `{ "src": "file name", "alt": "what it shows" }`. Stored for future project pages; not shown yet. | see below |
| `longDescription`, `features`, `challenges`, `solution`, `results` | Extra detail for future project pages; not shown yet. | |

Any line starting with `_` (like `"_help"`) is a comment and is ignored. JSON has no real comments, so this is the trick.

Screenshots example:

```json
"screenshots": [
  { "src": "screenshot-1.webp", "alt": "The search results page with filters open" },
  { "src": "screenshot-2.webp", "alt": "A car's detail page" }
]
```

## Categories

Current categories: `security`, `ai`, `fullstack`, `cloud`. You can also write the label (`"Full Stack"`, `"Full-Stack"`); capitals and hyphens don't matter.

The filter buttons above the project cards are built automatically, and a category's button appears as soon as one project uses it.

Need a **new** category? Add one line to `src/content/projectCategories.ts`. That is the only place categories are defined. Don't repeat category details in project files.

## Images

- Put them in the project's own `images/` folder. **Never import images in React code.**
- Reference them by **file name only**: `"cover.webp"`. (`"./images/cover.webp"` also works.)
- Allowed types: `webp`, `avif`, `png`, `jpg`, `jpeg`, `gif`, `svg`. WebP is a good default (small files).
- File names are case-sensitive on the build server: use lowercase (`cover.webp`, not `Cover.WEBP`).
- Aim for about 1200 px wide for a cover. Cards show it cropped to fit, so keep the important part in the middle.
- The build gives each image its final URL, so deployed paths just work.

## How the number on each card works

The `01`, `02`, `03` on the cards are generated from the sorted list. Don't store numbers anywhere. To move a project, change its `order`.

## Test it

```bash
npm run dev      # live preview; edits appear as you save
npm run build    # full check, exactly what gets deployed
```

If something in a `project.json` is wrong, you get a plain-English message naming the file and the problem (in the terminal and as an error overlay in the browser during `dev`; `build` prints it and stops). All problems are listed at once.

Common messages:

| Message | Fix |
| --- | --- |
| `"title" is required` | Add the missing field. |
| `Unknown field "technologes"` | Typo in a field name. |
| `"category" ... is not a known category` | Use one of the categories above, or add it in `projectCategories.ts`. |
| `"githubUrl" must point to a repository` | Use the full repo URL, or delete the line. |
| `"coverImage" refers to "x.webp", but that file is not in ... images/` | Put the file in `images/` or fix the name (check upper/lower case). |
| `still has the template placeholder text` | You copied `_template` but didn't replace the "Replace ..." text. |
| `This folder has no project.json` | Add one. Or, if it isn't a project, start the folder name with `_`. |
| `Not valid JSON` | A missing/extra comma, quote or bracket. Compare with another `project.json`. |

## Keep it honest

Only write what is true: real technologies, real features, working links. Leave out `githubUrl` / `liveUrl` if they don't exist yet rather than guessing. No invented users, clients or metrics.

## If you ask an AI to write the `project.json`

Paste this along with your project's README:

> Write a `project.json` for my portfolio using ONLY facts from this README. Fields: title, description (1-2 factual sentences, no hype), category (one of: security, ai, fullstack, cloud), technologies (only ones actually used). Include githubUrl/liveUrl only if they appear in the README. Do not invent features, users or metrics.

Then read what it produced before saving it.

## What you should never need to touch

`src/data/projects.ts`, `src/components/sections/ProjectsSection.tsx`, `src/components/projects/`, `src/types/index.ts`, any CSS. If adding a project seems to need any of these, something is wrong.

(How it works, if you're curious: `src/data/projects.ts` uses Vite's `import.meta.glob` to find every `src/content/projects/*/project.json` and its images, and `src/lib/projectContent.ts` validates them. `tools/projectContentPlugin.ts` runs the same checks during `npm run build`.)
