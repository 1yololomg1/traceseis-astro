# AGENTS.md

## Cursor Cloud specific instructions

This is an Astro v4 static site project located in `traceseis-astro/`. All development commands run from that subdirectory.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` (in `traceseis-astro/`) |
| Dev server | `npm run dev` (serves at `localhost:4321`) |
| Build | `npm run build` (outputs to `dist/`) |
| Preview prod | `npm run preview --host` (requires build first) |

### Key notes

- **Style scope**: The `BaseLayout.astro` uses `<style is:global>` so that CSS applies to slotted page content. Without `is:global`, Astro scopes styles and they won't reach child page elements.
- **Static output**: `astro.config.mjs` sets `output: 'static'` with `build.format: 'file'` (produces `.html` files). There is no SSR, no API routes, no database.
- **No external services**: No databases, Docker, env vars, or secrets are required. The only dependency is Node.js + npm.
- **Content policy**: All text on the site must be verifiable fact sourced from traceseis.com, AAPG Explorer, or Google Scholar. Do not add unverified claims, fake testimonials, or fabricated metrics.
- **Font**: Inter is loaded from Google Fonts. System font stack is the fallback.
- **CI**: GitHub Actions workflow (`.github/workflows/gh-pages.yml`) builds with Node 20 and deploys to GitHub Pages.
