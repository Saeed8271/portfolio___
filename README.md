# Saeed Anwar — Clean Portfolio Architecture

Inspired by the organization of the supplied S & I Dental Clinic website.

## Why this architecture?
- Root HTML pages contain their actual content (no fetched HTML partials).
- `css/` holds one stylesheet per section or shared component.
- `js/` holds small, separate behavior files.
- `images/` holds assets by category.
- No build tool, npm install, Vite, React, or framework required.

## Run locally
Open `index.html` in a browser, or use VS Code Live Server. Deploy directly to Netlify/Vercel static hosting.

## Update the Hero
Edit `index.html` (search for `class="hero"`) for text/markup; edit `css/hero.css` for styling.

## Update About Preview
Edit `index.html` (search for `id="about-preview"`) and `css/about-preview.css`.

## Important
- Put your portrait at `images/profile/saeed-profile.png`.
- Replace placeholder contact email in `contact.html`.
- Projects/blog content is starter content; replace with verified details before publishing.
- Header and footer markup appears in each HTML page, as in your clinic project. Keep them synchronized when changing navigation or footer.
- To add page-specific CSS, link it in the relevant HTML head. To add page-specific JS, add a `defer` script near the end of that page.
