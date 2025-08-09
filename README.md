# SolCity Electric Website

A lightweight, static marketing site for SolCity Electric (residential and light commercial electrical contractor in Arizona). The site is built with plain HTML, CSS, and a little vanilla JavaScript—no build tools or external dependencies.

## Features

- Responsive layout with a mobile nav menu
- Services, About, Credentials, Gallery, and Contact sections
- Lightbox gallery for project photos
- “Back to top” floating action button
- Accessible markup (skip link, ARIA labels, keyboard support)
- Basic SEO tags and social links

## Project Structure

```
.
├── index.html        # Main page markup
├── styles.css        # Site styles (CSS variables, responsive rules)
├── script.js         # Nav toggle, lightbox, back-to-top
└── assets/           # Images, icons, and logos
    ├── hero-image.png
    ├── az-flag.png
    ├── germy-garcia.jpg
    ├── logo-svg.svg
    ├── glyphs/       # SVG icons
    ├── services/     # Service card images
    └── gallery/      # Gallery images (1..30)
```

## Getting Started

No dependencies are required. You can open the site directly or run a tiny local server for nicer routing and caching behavior.

- Quick view: open `index.html` in your browser
- Local server (Python):
  - Python 3: `python3 -m http.server 8080`
  - Then visit: `http://localhost:8080/`

## Customization

- Content: Edit copy, links, and sections in `index.html`.
- Styles: Adjust color tokens and layout in `styles.css` (uses CSS variables for easy theming).
- Behavior: Tweak lightbox, nav, and utility interactions in `script.js`.
- Images: Replace assets in `assets/`. Keep similar dimensions/aspect ratios for best results.

## Accessibility & SEO

- Includes a visible-on-focus “Skip to content” link.
- Mobile nav supports outside-click and Escape-to-close.
- Lightbox traps focus on open and supports Escape to dismiss.
- Basic metadata: title, description, theme color, and favicons.

## Deployment

This is a static site—host it on any static web host:

- GitHub Pages: serve from repository root or `docs/`.
- Netlify/Vercel: drag-and-drop or connect repo (no build step).
- Any static host (S3/CloudFront, Nginx, Apache): upload the files as-is.

## Notes

- No framework or package dependencies are used. `package-lock.json` exists only as a placeholder; there is no `node_modules` or build process.
- License is not specified in this repository. Add a `LICENSE` file if you intend to open-source or share terms.

