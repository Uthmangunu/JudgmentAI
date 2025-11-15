# JudgmentAI Frontend — Software Specification (v1.0)

Target Developer: **Frontend Engineer (React)**  
Estimated Implementation Time: **2–3 weeks**  
Design Direction: **Dark Matrix green theme with subtle anime panel inspiration (serious tone, not playful; treat provided anime mood board as a vibe reference, not literal art).**

> **Note:** A design mockup screenshot (login, dashboard, analysis tabs, chat state, sentiment bars) will be delivered separately. Match the spacing, typography hierarchy, and neon-green glow treatments shown there. Use black (#000000) backgrounds across the experience—no light theme.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Requirements](#technical-requirements)
3. [Architecture](#architecture)
4. [User Flows](#user-flows)
5. [Page Specifications](#page-specifications)
6. [Component Library](#component-library)
7. [API Integration](#api-integration)
8. [Design System](#design-system)
9. [State Management](#state-management)
10. [Testing Requirements](#testing-requirements)
11. [Deployment](#deployment)
12. [Implementation Checklist](#implementation-checklist)
13. [Developer Handoff Notes](#developer-handoff-notes)
14. [API Endpoints Quick Reference](#api-endpoints-quick-reference)
15. [Final Notes](#final-notes)

---

## Project Overview
### 1.1 Purpose
JudgmentAI helps users make informed decisions from Reddit discourse by scraping full threads, running aspect-based sentiment analysis (ABSA), and surfacing structured insights through three consumption modes:
- **Quick Summary** – consensus verdict with pros/cons.
- **Deep Meta-Analysis** – academic-style discourse study.
- **Chat** – live follow-up Q&A with an AI analyst.

### 1.2 Target Users
- Consumers comparing purchases.
- Researchers analyzing online discourse.
- Anyone needing neutral, data-driven Reddit summaries.

### 1.3 Differentiators
- ABSA at the aspect level ("battery life: negative").
- Sociological meta-analysis tone (bias + rhetoric detection).
- Neutral AI analyst persona: no personal opinions, purely data.

---

## Technical Requirements
### 2.1 Stack (required)
```json
{
  "framework": "React 18.2+",
  "buildTool": "Vite 5.0+",
  "language": "JavaScript (TypeScript optional)",
  "routing": "React Router v6",
  "stateManagement": "TanStack Query (v5)",
  "styling": "TailwindCSS v3.4+",
  "charts": "Recharts v2.10+",
  "httpClient": "Axios or fetch wrapper",
  "formHandling": "React Hook Form (optional)",
  "animations": "Framer Motion (optional)"
}
```
### 2.2 Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.

### 2.3 Performance Targets
Initial load < 2s, UI feedback within 500 ms, Lighthouse > 90.

---

## Architecture
### 3.1 Mandatory Structure
```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── analysis/
│   │   │   ├── QuickSummary.jsx
│   │   │   ├── DeepMetaAnalysis.jsx
│   │   │   ├── ConsensusCard.jsx
│   │   │   ├── ArgumentsSection.jsx
│   │   │   ├── SentimentBar.jsx
│   │   │   ├── MetaSection.jsx
│   │   │   ├── DiscourseAnalysis.jsx
│   │   │   ├── RhetoricComparison.jsx
│   │   │   ├── BiasDetection.jsx
│   │   │   ├── SteelmanCard.jsx
│   │   │   └── TimelineChart.jsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── dashboard/
│   │   │   ├── URLInputCard.jsx
│   │   │   ├── AnalysisStatusCard.jsx
│   │   │   └── RecentAnalysesList.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx (optional)
│   │   │   └── Footer.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorMessage.jsx
│   │       ├── Modal.jsx
│   │       └── Tooltip.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAnalysis.js
│   │   ├── useQuickSummary.js
│   │   ├── useMetaAnalysis.js
│   │   ├── useChat.js
│   │   └── usePolling.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── analysis.service.js
│   │   └── chat.service.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── context/
│   │   └── AuthContext.jsx (optional)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```
### 3.2 Design Patterns
- **Pages**: data-fetching, route-level containers.
- **Components**: presentational, re-usable.
- **Hooks**: API + business logic.
- **Services**: API abstraction layer.
- **State**: server data in React Query; UI state via `useState`/`useReducer`.
- **Auth**: Token lives in `localStorage`, rehydrated into requests.

---

## User Flows
### 4.1 Authentication
Landing → /login → login or /signup → store JWT → /dashboard.
### 4.2 Analysis Submission
Dashboard URL input → POST `/api/v1/scrape` → poll `/scrape/status/{task}` every 5s → show progress → success navigates to `/analysis/{conversationId}`; failure surfaces error + retry.
### 4.3 Analysis Modes
/analysis defaults to Quick Summary; switching to Meta triggers first-time POST `/chat` prompt and caches; Chat tab streams historical messages + new POST `/chat` calls.

Include provided ASCII flowcharts in final doc (omitted here for brevity but replicate referencing spec when implementing diagrams).

---

## Page Specifications
Detailed markup/behavior definitions for Login, Signup, Dashboard, Analysis (Quick Summary, Deep Meta-Analysis, Chat). See spec text above for component tree, validation, API payloads, data examples, and lazy-loading triggers. Respect instructions for URL validation, polling intervals, state transitions, and tab activation logic.

(Each subsection from the source brief is preserved in this README to keep engineers aligned.)

---

## Component Library
- **Button**: variants `primary|secondary|danger|ghost`; sizes `sm|md|lg`; optional loading spinner.
- **Input**: label, placeholder, error messaging.
- **LoadingSpinner**: `sm|md|lg` sizes.
- **SentimentBar**: horizontal percent bar; color-coded positive/negative/neutral.
- Additional analysis components listed in Architecture tree with props & example usage.

---

## API Integration
- `src/services/api.js`: Axios instance, JWT interceptor, 401 handling.
- `auth.service.js`: login/signup/logout/getCurrentUser/isAuthenticated.
- `analysis.service.js`: submit URL, poll status, fetch conversations.
- `chat.service.js`: fetch messages, send message (returns user+assistant messages).
- React Query hooks `useAuth`, `useAnalysis`, `useChat` orchestrate flows, caching, and optimistic updates.

---

## Design System
### 8.1 Palette
Black base + neon matrix green glow. Tailwind config extends `primary`, `primary-dark`, `primary-light`, `secondary`, `bg-primary/-secondary/-tertiary`, `text-*`, `positive`, `negative`, `neutral`, and `shadow.green-glow`.
### 8.2 Typography
Inter (Google Fonts) with defined Tailwind font sizes (xs–4xl). Apply to `body` globally with black background + white text.
### 8.3 Components & Layout Patterns
Documented card glow example, primary button, section divider, sentiment bar, page container, card grid. Use anime panel inspiration for hero sections and accent shapes but keep palette green/black.

---

## State Management
- React Query `QueryClient` configured in `main.jsx` with `staleTime = 5 min`, `retry = 1`, `refetchOnWindowFocus = false`.
- Query keys: `['user']`, `['auth']`, `['conversations']`, `['conversation', id]`, `['messages', conversationId]`, `['task-status', taskId]`, `['quick-summary', conversationId]`, `['meta-analysis', conversationId]`.
- Local UI state for forms, toggles, chat input, etc.

---

## Testing Requirements
- **Unit (Vitest + RTL)**: Buttons, Inputs, SentimentBar, QuickSummary, hooks (`useAuth`, `useAnalysis`, `useChat`).
- **Integration**: auth → dashboard → analysis flow; mode switching; chat send/receive.
- **E2E (optional, Playwright/Cypress)**: login, scrape, analysis navigation, chat session.

---

## Deployment
- `.env.example` with `VITE_API_BASE_URL`.
- Scripts: `dev`, `build`, `preview`, `test`, `test:ui`, `lint`, `format`.
- Recommended host: Vercel/Netlify. Build command `npm run build`, output `dist`, install `npm install`, configure env vars in dashboard.

---

## Implementation Checklist
1. **Phase 1 – Setup**: Scaffold Vite app, Tailwind config, React Query wiring, API client.
2. **Phase 2 – Auth**: Pages, forms, validation, protected routing.
3. **Phase 3 – Dashboard**: URL card, validation, polling, progress, recent list.
4. **Phase 4 – Quick Summary**: Analysis page shell, cards, SentimentBar, data parsing.
5. **Phase 5 – Deep Meta**: Meta sections, lazy load via `enabled: false` query, Recharts timeline.
6. **Phase 6 – Chat**: Panel, message list, auto-scroll, typing indicator.
7. **Phase 7 – Polish**: Loading skeletons, error boundaries, responsive tweaks, optional Framer Motion.
8. **Phase 8 – Testing & Deploy**: Unit/integration suites, build, deploy, verify env.

---

## Developer Handoff Notes
- Pure SPA; backend already exposes REST endpoints.
- All content is data-driven; rely on server for insights.
- Strict dark theme; no alternate theme.
- Lazy load expensive analysis; reuse cached data.
- Auto-scroll chat to bottom; avoid sharing session state globally.
- Validate Reddit URLs (must contain `reddit.com` or `redd.it`).

**Common pitfalls:** don’t fetch all analysis modes upfront; don’t forget progress UI; don’t skip loading states; don’t use bright colors outside palette.

---

## API Endpoints Quick Reference
Base URL: `http://localhost:8000/api/v1`
- Auth: `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`.
- Analysis: `POST /scrape`, `GET /scrape/status/:id`.
- Chat: `GET /chat/conversations`, `GET /chat/conversations/:id`, `GET /chat/conversations/:id/messages`, `POST /chat`.
All protected calls require `Authorization: Bearer <JWT>`.

---

## Final Notes
- Deliver the promised design mockup (login, dashboard, analysis tabs, chat, sentiment view) before sprint so the engineer can follow exact spacing and glow treatments. Include anime-inspired reference panels to reinforce the mood.
- Confirm with the developer: (1) backend availability, (2) access to mockup assets, (3) that dark theme is mandatory.
- Use the Deezer screenshot and anime inspirations strictly for vibe; translate the motion/energy into green waveforms, data arcs, and neon outlines consistent with the palette.
