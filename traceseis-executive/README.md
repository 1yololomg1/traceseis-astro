# TraceSeis Executive Website

A modern, professional website for TraceSeis - quantitative reservoir characterization through advanced geoscience solutions.

## Technology Stack

- **Framework**: [Astro](https://astro.build/) v5.x - Static site generator with zero JS by default
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.x - Utility-first CSS framework
- **Deployment**: Static files - deploy anywhere (Netlify, Vercel, GitHub Pages, AWS S3, etc.)

## Project Structure

```
traceseis-executive/
├── public/
│   ├── downloads/          # Software downloads (zip files)
│   │   └── seistool-windows.zip
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # Main layout with nav/footer
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── services.astro      # Services overview
│   │   ├── confirm.astro       # CONFIRM methodology
│   │   ├── software.astro      # Software downloads
│   │   ├── about.astro         # Company information
│   │   ├── partners.astro      # Strategic partners
│   │   ├── resources.astro     # Publications & references
│   │   └── contact.astro       # Contact form & info
│   └── styles/
│       └── global.css          # Tailwind + custom styles
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding Software Downloads

1. Place your zip file in `public/downloads/`
2. Link to it: `<a href="/downloads/filename.zip" download>Download</a>`
3. The file will be served directly as a static asset

### Contact Form

The contact form currently uses a placeholder action. To enable:

1. Set up a form handler (Formspree, Netlify Forms, etc.)
2. Update the form action in `src/pages/contact.astro`

## Deployment

### Build Output

```bash
npm run build
```

Output is in the `dist/` folder - pure static HTML/CSS/JS.

### Hosting Options

- **Netlify**: Connect repo, auto-deploys on push
- **Vercel**: Connect repo, auto-deploys on push  
- **GitHub Pages**: Use GitHub Actions workflow
- **AWS S3 + CloudFront**: Upload dist/ to S3, serve via CloudFront
- **Any static host**: Upload dist/ contents

### Environment

No environment variables required for basic deployment.

## Design Principles

- **Executive-focused**: Clean, professional design targeting technical decision makers
- **Trust-building**: Scientific credibility emphasized throughout
- **Performance**: Zero JavaScript by default, fast load times
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels
- **SEO**: Meta tags, structured data, semantic markup

## Content Guidelines

All technical claims should be:
- Based on established scientific principles
- Traceable to peer-reviewed literature
- Accurately representing capabilities without overpromising

## License

Proprietary - TraceSeis Inc.
