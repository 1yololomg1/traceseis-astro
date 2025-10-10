# TraceSeis Astro Preview

Free, static preview of a modern TraceSeis site built with Astro. Fact-only content from traceseis.com and AAPG Explorer.

## Local dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
# output in dist/
```

## GitHub Pages deploy (free)
- Create a GitHub repo (public or private)
- Push this project with default branch `main`
- In repo Settings → Pages → Build and deployment → Source: GitHub Actions
- The included `.github/workflows/gh-pages.yml` will publish automatically on push to `main`
- Your site will be live at: https://YOUR-USER.github.io/REPO-NAME/

## Cloudflare Pages (free, optional)
- Create a new Pages project and connect the GitHub repo, or use Direct Upload (upload `dist/`)
- Resulting preview URL: https://YOUR-SITE.pages.dev

No cookies, no tracking scripts included. Add Cloudflare Web Analytics later if desired.
