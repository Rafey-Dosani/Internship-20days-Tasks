# Day 3: TypeScript Essentials

A TypeScript version of the Day 2 searchable user directory. It uses React, Vite, and plain CSS to fetch JSONPlaceholder profiles and search by name or email.

## Setup and commands

Requires Node.js and npm. From this folder, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Verify types and create a production build with:

```bash
npm run typecheck
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Features

- Loads and displays user profiles from `https://jsonplaceholder.typicode.com/users`.
- Filters by name or email as you type; matching is case-insensitive, whitespace is trimmed, and a blank search shows all profiles.
- Includes loading, error with retry, no-match, and successful results states.
- Cancels the active network request when the component unmounts or a retry replaces it.
- Retains the responsive layout and reusable header, search, list, and user-card components from Day 2.

## TypeScript concepts used

- **Primitive types:** strings, numbers, and booleans are used for component props and React state.
- **Interfaces:** `User`, `UserAddress`, `UserGeo`, and `UserCompany` describe the JSONPlaceholder response; component prop interfaces document each component's inputs.
- **Union types:** `DirectoryStatus` limits the UI status to `loading`, `error`, or `success`.
- **Literal types:** the avatar color tuple creates a fixed set of valid color names.
- **Event and callback types:** the search input uses React's `ChangeEventHandler<HTMLInputElement>`, while component props specify the values and callbacks they accept.
- **Safe API handling:** response JSON starts as `unknown` and is checked with a type guard before being used as `User[]`; caught errors are narrowed from `unknown`.
- **Typed React state:** `useState<User[]>` and the other state annotations make the expected state values explicit.
