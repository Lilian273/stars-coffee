# stars-coffee

Stars Coffee — Nazareth cafe site (Framer-style landing).

**Design & development:** DEVBYLILIAN

## Structure

```
stars-coffee/
├── FRONTEND/     Static site (HTML, CSS, JS)
└── BACKEND/      API / server (placeholder)
```

## Editing the menu

All menu content lives in `FRONTEND/js/menu-data.js`. Each category becomes a tab and each
item becomes a card. For an item with several sizes, `sizes` and `prices` are matched by
position, so the two lists must stay the same length.

Individual categories are linkable: `/#menu-mojito` opens the site with that tab selected.

## Run locally

From the project root:

```bash
npm install
npm run dev
```

Opens the site at http://localhost:5173/ (Vite serves the `FRONTEND` folder).

You can also open `FRONTEND/index.html` directly in a browser.

## Deploy

Point your host’s publish directory at **`FRONTEND`** (Netlify, Vercel, GitHub Pages, etc.).
