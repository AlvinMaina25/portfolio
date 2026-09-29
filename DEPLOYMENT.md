# Deploying the portfolio (manual, hosting-neutral)

This project is a static site: `npm run build` produces plain HTML, CSS, JS and images in `dist/`.
There is no server, database or router, so any host that can serve static files at the root of
`https://alvinsolutions.co.ke/` will work. Nothing in this repository is tied to a hosting provider.

## 1. Before deployment

1. Install dependencies exactly as locked:

   ```
   npm ci
   ```

2. Set the three environment variables. Locally, copy `.env.example` to `.env.local` (Git ignores it).
   On a host that builds for you, enter them in its environment-variable settings instead.

   ```
   VITE_FORMSPREE_ENDPOINT=
   VITE_WHATSAPP_NUMBER=
   VITE_CONTACT_EMAIL=alvinmaina2505@gmail.com
   ```

   | Variable | What to put | If left empty |
   | --- | --- | --- |
   | `VITE_FORMSPREE_ENDPOINT` | Your Formspree form URL, `https://formspree.io/f/...` | The form shows its "something went wrong" message; nothing is sent |
   | `VITE_WHATSAPP_NUMBER` | Digits only, country code first, no `+` | WhatsApp link and the form's WhatsApp fallback are hidden |
   | `VITE_CONTACT_EMAIL` | Your public email address | Every email link and address is hidden |

   **Formspree dashboard (manual step):** the endpoint only tells the site *which* form to post to. Which inbox receives the messages is configured in your Formspree account: open the form, go to its settings, and set the notification/destination email to `alvinmaina2505@gmail.com`. Nothing in the code can do this for you. Messages arrive with the subject `New portfolio inquiry — <topic>` and the visitor's address as reply-to.

   Every `VITE_*` value is written into the public JavaScript, so treat it as public. Never put
   passwords, API keys or tokens in these variables. Vite reads them **at build time**: if you change
   one, build and deploy again.

3. Optional but recommended: run the checks, then build.

   ```
   npm run lint
   npx tsc -b
   npm run build
   ```

   `npm run build` runs `tsc -b` and then `vite build`. It also fails, with a readable message, if any
   `src/content/projects/*/project.json` is invalid.

## 2. What to upload

The build output is the `dist/` folder. Deploy **the contents of `dist/`** so that `index.html` sits at
the root of the site. Preview it first with `npm run preview` (it serves `dist/` locally).

The site lives at the domain root, so the Vite `base` is the default `/` and needs no change. If you
ever host it under a sub-path instead, that setting and the URLs in `index.html`, `robots.txt` and
`sitemap.xml` all have to change.

## 3. Domain and HTTPS

- Custom domain: `alvinsolutions.co.ke`. Point it at your host using the DNS records your host gives you.
- HTTPS is required. Enable it (usually a free certificate from the host) and make sure `http://` redirects
  to `https://`. The canonical URL, Open Graph URL, sitemap and robots file all use
  `https://alvinsolutions.co.ke/`.
- Decide whether `www.alvinsolutions.co.ke` should exist. If so, redirect it to the bare domain so search
  engines see one address.

## 4. Check the live site

Open the production URL in a normal browser window and an incognito one, and check:

- [ ] Homepage loads, the loading screen leaves, and there are no errors in the browser console
- [ ] `https://alvinsolutions.co.ke/robots.txt` shows the robots file
- [ ] `https://alvinsolutions.co.ke/sitemap.xml` shows the sitemap
- [ ] Favicon appears in the browser tab (hard-refresh if you see an old one)
- [ ] Contact form: submit a real test message, confirm it arrives in Formspree, and that empty or invalid fields show errors
- [ ] WhatsApp link opens a chat with the right number and pre-filled message
- [ ] Email link opens your mail app with the right address
- [ ] GitHub links to `https://github.com/AlvinMaina25` and LinkedIn to `https://www.linkedin.com/in/alvin-maina-2170522a8/`
- [ ] Project cards all appear, in the order you expect, and each demo button opens the right site
- [ ] Project images load (Network tab: no red 404s)
- [ ] Mobile layout: check on a real phone or the browser's device toolbar; nothing scrolls sideways, the menu opens and closes
- [ ] Search the page source and Network tab for `localhost` or `127.0.0.1`: there should be none
- [ ] Optional: with your OS set to "reduce motion", the site should show no typing, particles or cursor effects

## 5. Adding a project later

Create `src/content/projects/<folder>/project.json` (copy `_template`) and put images in its `images/` folder.
No other file needs editing. See `ADDING_A_PROJECT.md`. Then run `npm run build` and deploy the new `dist/`.

## 6. Optional after launch

- Add a social preview image and an Apple touch icon (see section 9 of `CONTENT_REVIEW.md`).
- Submit `https://alvinsolutions.co.ke/sitemap.xml` in Google Search Console.
- After adding a social image, test link previews in LinkedIn's Post Inspector and similar tools.
