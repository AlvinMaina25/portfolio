# Content review: facts that need the owner's confirmation

Phase 10 removed or reworded anything that contradicted the project data or could not be backed
by the source, and did **not** invent replacements. Everything below is still open. Nothing here
is verified, because no CV, credential links, repository URLs or corrected contact details were supplied.

## 1. Must be set before publishing

| Item | Where | What is needed |
| --- | --- | --- |
| Contact email | `.env.local` -> `VITE_CONTACT_EMAIL` | The real public email. Until it is set, every email link and address is hidden. (`legacy/script.js` contains `alvinmaina2505@gmail.com` marked "replace"; it was **not** used because it was never confirmed.) |
| WhatsApp number | `.env.local` -> `VITE_WHATSAPP_NUMBER` | Digits only, country code first. (`legacy/script.js` has a number under "YOUR number"; not copied into the code.) |
| Formspree endpoint | `.env.local` -> `VITE_FORMSPREE_ENDPOINT` | Without it the contact form cannot send. |
| CV | `public/resume/` + `resumeUrl` in `src/data/site.ts` | The PDF. The Download CV button stays hidden until then. |

## 2. Links

- **GitHub / LinkedIn** (`site.ts`, and `sameAs` in `index.html`): **confirmed by the owner in Phase 13** as `https://github.com/AlvinMaina25` and `https://www.linkedin.com/in/alvin-maina-2170522a8/`. The earlier `alvinmaina` URLs from the legacy site were wrong and are gone.
- **X/Twitter**: removed. It only ever pointed at the bare `twitter.com` homepage and no handle exists in the source. Add the real profile URL to `socials` in `site.ts` if you want it back.
- **Project GitHub buttons**: removed from all five projects. They all pointed to the bare `https://github.com` homepage, not a repository. Add `"githubUrl"` to each project's `project.json` (in `src/content/projects/<name>/`) once repo URLs are known.
- **Live/demo links**: kept exactly as in the legacy site, but **none could be checked** (they were not reachable from the audit environment). Please open each one:
  - Kingdom App -> `easytenancy-7ddf4.web.app`. The Firebase project name says "easytenancy", which does not match "Kingdom App". Confirm this is really the Kingdom App demo, or replace it.
  - AI Assistant, Cybersecurity Lab ("Case Study"), Analytics Dashboard -> auto-generated Netlify URLs. Confirm each is live and shows the right project.
  - Cloud Deploy System has no link and no repository. Its card has no buttons. Confirm the project exists and whether it can be shown (repo, diagram, write-up).

## 3. Project claims (descriptions only use what the legacy text stated; please confirm each)

- Kingdom App: real-time messaging, event management, media streaming, role-based access, and the `Node.js` tag.
- AI Assistant: custom memory management, voice output, embeddable-widget mode.
- Cybersecurity Lab: threat-detection dashboards; the `Splunk` tag.
- Analytics Dashboard: the "ML-powered insights" claim was **dropped** because no ML library is listed in its technologies. If it does use ML, say which library and restore it. It sits in the "AI / ML" filter; move it to "Full Stack" if it is not ML.
- Cloud Deploy System: the "zero-downtime deployments with rollback" and "microservices" claims were dropped as unsupported. Restore only if true.

## 4. Numbers

- "15+ projects" -> now **5**, computed from the projects found in `src/content/projects/` (it updates itself as you add projects). If there is other work you want counted, add those projects (see `ADDING_A_PROJECT.md`) or supply evidence.
- Certifications "6+" -> now **4 completed** (two are in progress), computed from `certifications.ts`. "Tech domains 4+" -> **4 project areas**, computed. The "+" suffixes are gone.
- "40+ members" (debate club): kept, unverified. Confirm the figure, or reword to something you can stand behind.

## 5. Certifications and courses

- No credential links exist. Add `credentialUrl` to each completed item so visitors can check it.
- "Verified" was renamed **Completed**, because nothing on the page verified anything. Please confirm you completed all four.
- **AWS Cloud Practitioner**: is this the proctored *AWS Certified Cloud Practitioner* exam, or the free *Cloud Practitioner Essentials* course? The two are different. Give me which one and the exact title. It has no `kindLabel` until then.
- `kindLabel` values (Course, Professional Certificate, Specialization, Learning path) reflect how the issuers name those programs. **CCNA: Introduction to Networks is a Cisco course, not the CCNA certification.** Confirm the labels match what you hold.

## 6. Experience

- "University Debate Society": is this the real name? Name the university if you want it shown.
- Start dates (2023, 2021, 2022) are unverified.
- "Personal & Freelance Projects": were any of these paid client jobs? If yes, add what and for whom. If not, drop "Freelance" from the organization name.
- Removed unsupported wording: "real users", "production-grade", "open-source contributions", "scalable backends" (independent developer), and "structured offensive security research" (the role is now titled "Cybersecurity Lab Practice", labelled Self-directed study).

## 7. Skills

- Percentage bars became **self-assessed categories** (Advanced 85+, Proficient 78-82, Intermediate 72-76), keeping the legacy order. Confirm you are comfortable with "Advanced" for Web Development and Software Engineering.
- Tags that appear in no project and are unconfirmed: TensorFlow, scikit-learn, Wireshark, Nmap, NumPy, Matplotlib, GCP, Java, Android, Cisco. Remove any you do not actually use.

## 8. Other copy

- Availability ("Open to opportunities", `isAvailable: true` in `site.ts`): confirm this is currently true.
- Hero roles now: Full-Stack & AI Developer, Security-Focused Developer, Software & AI Developer (Phase 14: the author has graduated, so no student wording remains). "Cybersecurity Engineer" and "Cloud & Software Engineer" were dropped because the portfolio does not support those titles yet.
- "Open Source Advocacy", "Scalable Architecture" and "24/7 Builder" were removed (no repositories or evidence). "Since 2021" comes from the Experience start date, so it depends on item 6.
- `index.html` metadata was aligned with the hero in Phase 12 (title, description, Open Graph, X card, JSON-LD). If the hero roles in `site.ts` change, update the title and description in `index.html` to match.

## 9. Still needed for SEO / social (Phase 12)

| Item | Where | What is needed |
| --- | --- | --- |
| Social preview image | `public/` + `index.html` | A 1200x630 PNG/JPG. Until it exists there is no `og:image`/`twitter:image` tag and the X card is `summary`. The exact tags to add are in a comment in `index.html`. |
| Apple touch icon / PNG favicon | `public/` + `index.html` | `public/favicon.svg` re-encodes the previous hexagon favicon as a real file. Add a 180x180 PNG `apple-touch-icon` once you have a logo you want to use. |
| `alvinsolutions.co.ke` in code | `index.html`, `public/robots.txt`, `public/sitemap.xml` | The domain is written out in these three places (crawlers do not run JavaScript). Change all three together if the domain ever changes. |

## Phase 14 items to confirm

- Debate club: the entry still says "2023 — Present" and the About text now says "I've also chaired my university's debate club". Confirm whether the role is still current and whether the dates and the "40+ members" figure are right.
- "CS Graduate" (About mini-stat) and "Computer Science graduate" (hero, About, metadata) are based on your statement that you have graduated. Add the degree title or institution only if you want them shown.
- Formspree dashboard: set the form's notification/destination email to alvinmaina2505@gmail.com (see DEPLOYMENT.md).
