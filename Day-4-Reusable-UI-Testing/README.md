# Day 4: Reusable UI and Front-End Testing

A standalone React and TypeScript user management app built with Vite. It demonstrates reusable buttons, labeled inputs, a typed table, accessible form validation, and user search.

## Requirements

- Node.js and npm

## Setup

From this directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Checks and tests

```bash
npm run typecheck
npm test
npm run build
```

Vitest runs the React Testing Library suite in a jsdom environment. The tests cover required fields, invalid email addresses, successful user creation, name and email search, and the empty-results state.

## Project structure

- `src/components/` — reusable `Button`, `Input`, `Table`, and `AddUserForm` components.
- `src/types/` — shared user data types.
- `src/test/` — shared Vitest setup.
- `src/App.test.tsx` — user management behavior tests.
- `src/App.tsx` — searchable user directory and application state.
