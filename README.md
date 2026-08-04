# Emmanuel T. | Portfolio v2

Personal portfolio of **Emmanuel Tejeda**, full-stack software developer. Built with **Astro** for a high-performance, route-based architecture with selective **React** islands.

**Live site:** [emmanueltejeda.com](https://emmanueltejeda.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Meta-framework | Astro 6 |
| UI framework | React 19 (Islands) |
| Language | TypeScript 6 (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Internationalisation | i18next (EN + IT) |
| Forms | React Hook Form + Zod + Netlify Forms |
| Testing | Vitest + React Testing Library |
| Deployment | Netlify (Security headers, partial hydration) |

---

## Features

- Route-based architecture: content lives at `/` (about), `/development`, `/audio`, `/contact`
- Selective hydration: `client:idle` for chrome widgets, `client:visible` for in-page islands
- Full i18n (English / Italian) with server-side locale synchronisation
- Light / dark mode with no flash on load (theme stored in `localStorage`)
- Live availability indicator driven by Rome business hours
- Netlify Forms contact integration with honeypot spam protection
- Keyboard-accessible navigation
- Accessible modal with focus trapping and scroll lock
- SVG favicon + web app manifest

---

## Project Structure

```
src/
├── components/       # React islands and UI primitives
│   ├── about/        # About components
│   ├── audio/        # Audio components
│   ├── contact/      # Contact components
│   ├── development/  # Dev components
│   └── ui/           # Shared primitives (Button, Typography, Modal, Badge…)
├── hooks/            # Custom hooks (useRomeAvailability, …)
├── layouts/          # Astro layouts
├── locales/          # i18n translation files (en, it)
├── pages/            # Astro route pages
├── utils/            # Pure utilities (cn, motion-variants, rome-sky-phase)
└── index.css         # Global styles / Tailwind layers
public/
├── favicon.svg       # SVG favicon
├── site.webmanifest  # PWA / installable app metadata
└── robots.txt
```

---

## Getting Started

### Prerequisites

- Node.js **24** (`nvm use` if you have [nvm](https://github.com/nvm-sh/nvm); see `.nvmrc`)
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Production build (Astro) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check Astro, TypeScript, and component diagnostics |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Run unit tests with coverage thresholds |
| `npm run test:e2e:install` | Install Chromium for browser tests |
| `npm run test:e2e` | Run the Playwright browser suite |

---

## Deployment

The site is deployed automatically to Netlify on every push to `main`. Configuration lives in [`netlify.toml`](netlify.toml).

- Build command: `npm run build`
- Publish directory: `dist/`
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
