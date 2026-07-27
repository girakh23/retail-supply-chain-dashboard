# Retail Supply Chain Analytics Dashboard (Portfolio Demo)

A standalone **React 18 + TypeScript** proof-of-concept built to showcase front-end
patterns used on enterprise retail supply-chain / AI dashboard work:

- **TypeScript** throughout (`.tsx`, typed domain models in `src/types.ts`)
- **React Router** (`react-router-dom`) — real client-side routing between
  Overview / Inventory / Pricing / AI Insights, not just tab-state switching
- **Mock REST data layer** (`src/api.ts`) — async functions that simulate real
  `fetch("/api/...")` calls (with network delay, loading states, error handling).
  Swapping each function body for a real `fetch` is the only change needed to
  point this at a live backend.
- **React Hooks** (`useState`, `useEffect`, `useMemo`) driving data loading,
  filtering, and pagination
- **Filtering + pagination** on a shared, reusable `<DataTable>` component
- **Role-based navigation** — Analyst / Manager / Admin switch changes which
  table columns are visible
- **Recharts** dashboards — price trend line chart, inventory-vs-reorder bar chart
- **AI-driven insight panel** — recommendation cards with confidence scores,
  styled after an Azure-AI-style recommendation service
- **Component-driven architecture** — pages, shared components, types, and data
  layer are all separated into their own files (see structure below)

**All data in this demo is synthetic.** No employer or client code, data, or IP is
included — this is an original build that demonstrates the same patterns and stack.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173). Try switching
roles, using the left-hand nav (real routes — the URL hash changes), filtering
the table, and paging through results.

## Get a public demo link (recommended for sharing with a client)

**StackBlitz / CodeSandbox (fastest, zero install)**
1. Go to https://stackblitz.com/ or https://codesandbox.io
2. Create a new Vite + React + TypeScript project
3. Replace the generated `src/` folder with this project's `src/` folder
4. Share the generated sandbox URL directly as your demo link

**Vercel**
1. Push this folder to a new GitHub repo
2. Go to https://vercel.com/new, import the repo, click Deploy
3. Vercel auto-detects Vite — live `https://your-project.vercel.app` link in ~1 minute

**Netlify Drop**
1. Run `npm run build` locally first (creates a `dist` folder)
2. Drag the `dist` folder onto https://app.netlify.com/drop
3. Get a live link immediately — no account required

> This project uses `HashRouter` (URLs look like `/#/overview`) specifically so
> the build works on any static host with zero server configuration. If you
> deploy behind a server/CDN that already rewrites all paths to `index.html`,
> you can swap to `BrowserRouter` in `src/App.tsx`.

## Project structure

```
src/
  types.ts                 shared TypeScript domain types (Sku, Insight, etc.)
  api.ts                   mock REST data layer (simulated async endpoints)
  App.tsx                  route definitions (react-router-dom)
  Shell.tsx                app shell: nav rail, header, role switcher, KPI ticker
  main.tsx                 React entry point
  components/
    Tokens.tsx             design tokens (CSS variables) + font loader
    Pill.tsx                status/tag pill atoms
    InsightCard.tsx        AI recommendation card
    DataTable.tsx          reusable filterable/paginated table
  pages/
    Overview.tsx           charts + top AI recommendations
    Inventory.tsx          full inventory table
    Pricing.tsx            full pricing table
    Insights.tsx           full AI insights list
```
