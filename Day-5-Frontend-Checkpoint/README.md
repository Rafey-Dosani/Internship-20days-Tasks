# Day 5 — Northstar Admin Dashboard

A polished, responsive mini dashboard for a fictional online store. It presents business summary metrics and recent customer activity using local mock data, with interactive section navigation and search.

## Technologies

- React 19
- TypeScript
- Vite
- CSS
- [Lucide React](https://lucide.dev/) icons

## Features

- Sidebar navigation for the overview, users, and orders activity.
- Responsive mobile navigation drawer with backdrop and keyboard-accessible controls.
- Summary cards populated from typed mock data.
- Recent activity table with customer details, references, dates, and order status.
- Search by customer name or email from either search field.
- Clear empty, loading, and retryable error states.
- Semantic page landmarks, accessible labels, visible keyboard focus, and reduced-motion support.
- No paid APIs or external data services required.

## Folder structure

```text
Day-5-Frontend-Checkpoint/
├── src/
│   ├── components/
│   │   ├── ActivityTable.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── SummaryCard.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

## Installation

Requires Node.js and npm. From this folder, install dependencies:

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the local address printed by Vite. Verify types, create a production build, and run the linter with:

```bash
npm run typecheck
npm run build
npm run lint
```

## Screenshots

Screenshots can be added here after capture:

- Desktop: `screenshots/dashboard-desktop.png`
- Tablet: `screenshots/dashboard-tablet.png`
- Mobile: `screenshots/dashboard-mobile.png`

## Design decisions

- A calm neutral canvas, compact typography, and violet accents keep dashboard data prominent without visual clutter.
- Summary figures and activity rows share a single typed data module, so the interface works offline and needs no API credentials.
- Sidebar selection filters the activity to users or orders; both search fields filter the currently selected section by customer name and email.
- The sidebar becomes an off-canvas drawer on narrow screens, while the activity table hides its date column on mobile to avoid horizontal scrolling.
- Reports and Settings are shown as disabled navigation items because those screens are outside this checkpoint's scope.
