# JudgmentAI Frontend

Neon-black React SPA for analyzing Reddit discussions through three modes: Quick Summary, Deep Meta-Analysis, and Chat with an AI analyst. The UI follows the Matrix-green palette plus anime-inspired hero accents described in `SPEC.md`.

## Stack
- React 19 + Vite 7
- React Router v6, TanStack Query v5
- TailwindCSS 3.4, clsx
- Axios API client, React Hook Form
- Recharts for sentiment timeline
- Vitest + Testing Library for unit tests

## Getting Started
1. `cp .env.example .env` and set `VITE_API_BASE_URL`.
2. `npm install`
3. `npm run dev` → http://localhost:5173
4. Ensure the FastAPI backend is running on the same base URL.

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built assets
- `npm run test` / `npm run test:ui` – Vitest CLI or UI
- `npm run lint` – ESLint against `src`
- `npm run format` – Prettier format pass

## Project Structure
```
frontend/
├── public/           # favicon + SVG logo
├── src/
│   ├── components/   # auth, analysis, chat, dashboard, layout, common
│   ├── pages/        # Login, Signup, Dashboard, Analysis, NotFound
│   ├── hooks/        # useAuth, useAnalysis, useQuickSummary, etc.
│   ├── services/     # axios client + auth/analysis/chat services
│   ├── utils/        # constants, validators, formatters, helpers
│   ├── context/      # AuthProvider + hook
│   └── tests/        # Vitest setup + specs
└── SPEC.md           # Full product requirements
```

## Key Features
- Auth forms with validation + React Query mutations.
- Dashboard with Reddit URL validation, scrape polling, progress card, and recent analyses list.
- Analysis page with tabbed Quick Summary, lazy Deep Meta-Analysis (Recharts timeline + steelman/bias sections), and chat panel with optimistic updates.
- Global AppShell (Navbar, Sidebar, Footer) and dark neon design tokens in Tailwind config.
- Axios client with JWT interceptors and auto-redirect on 401s.

## Testing
Run `npm run test`. Coverage includes button/input primitives, SentimentBar, QuickSummary (hook mocked), plus hooks for auth/analysis/chat. Vitest is configured with jsdom and Testing Library in `vite.config.js`.

## Deployment
Build with `npm run build`. Deploy `/dist` (Vercel/Netlify). Remember to set `VITE_API_BASE_URL` in the hosting dashboard.

For detailed UX, data contracts, and copy requirements see `SPEC.md`. The backend setup guide lives in the repository root (`GETTING_STARTED.md`).
