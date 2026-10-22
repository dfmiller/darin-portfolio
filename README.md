# Darin F Miller — Portfolio

Personal portfolio and reusable-component showcase for Darin F Miller, Senior Software Engineer.

**Live site:** https://darin-portfolio-ten.vercel.app

## What's in it

- **Profile** (`/`) — landing hero, experience timeline, case studies, skills and side projects. Content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).
- **Reusable Components** (`/design-systems`) — a small design system built on Vuetify, split into three tabs (deep-linkable via the URL hash):
  - `#components` — a catalog of every `Base*` component in its states (buttons, fields, dialog, rich text, table, tabs, toast…).
  - `#sample` — a realistic users table with search, sorting, paging, add/edit/delete, a full-page mode, and a sticky header and first column. Data comes from [jsonfakery.com](https://jsonfakery.com/users/paginated); edits are local only.
  - `#info` — notes on the design system.
- Light and dark themes (remembered in `localStorage`), collapsible desktop navigation and a drawer on mobile.

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>`) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev and build
- [Vuetify 3](https://vuetifyjs.com/) with [Material Design Icons](https://pictogrammers.com/library/mdi/)
- [Vue Router](https://router.vuejs.org/)
- [Tiptap](https://tiptap.dev/) for the rich text editor
- Deployed on [Vercel](https://vercel.com/) (`vercel.json` rewrites all routes to `index.html` for the SPA)

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check (vue-tsc) and build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
├── components/
│   ├── Base/          # Reusable design-system components (BaseButton, BaseTable, BaseRichText, …)
│   ├── home/          # Profile page sections
│   ├── AppHeader.vue
│   ├── AppNavigation.vue
│   └── PageHeader.vue
├── data/portfolio.ts  # Profile content
├── layouts/           # DefaultLayout (app shell, skip link, theme toggle)
├── plugins/vuetify.ts # Vuetify setup and light/dark theme colors
├── router/            # Routes
├── views/             # HomePage, design-system tabs, Settings, NotFound
└── style.css          # Global styles
```

## Design system conventions

- Pages use the `Base*` wrappers rather than raw Vuetify components, so behavior and accessibility are consistent.
- Colors come from the Vuetify theme (`src/plugins/vuetify.ts`), never hard-coded in components. `surface-light` / `on-surface-light` are the tints used for toolbars, table headers and sticky columns.
- `BaseTable` renders a data table on desktop and switches to stacked cards at 600px and below.

## Accessibility and responsiveness

- Skip-to-content link, semantic landmarks, and a single `h1` per page.
- Icon-only buttons require a `label` (`BaseIconButton`), and toggles expose `aria-pressed` / `aria-expanded`.
- Visible focus outlines, keyboard-operable rows, tables and menus, and `prefers-reduced-motion` support.
- The rich text toolbar is a labelled `role="toolbar"`, with larger touch targets on touch devices.
- External links announce that they open in a new tab.
- Layouts are built to work from 320px wide upward without horizontal page scroll.

## Deployment

Pushing to the main branch deploys through Vercel. The build command is `npm run build` and the output directory is `dist`.
