# Day 2: Searchable List

A responsive user directory built with React, Vite, and plain CSS. It fetches sample profiles from JSONPlaceholder and lets you search by a user's name or email.

## Setup

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Features

- Loads user profiles from `https://jsonplaceholder.typicode.com/users`.
- Shows each user's name, email, phone number, and city.
- Filters by name or email as you type; matching is case-insensitive and surrounding whitespace is ignored. A blank search shows all profiles.
- Presents loading, error with retry, no-match, and successful results states.
- Cancels the active network request when the component unmounts or a retry replaces it.
- Uses reusable header, search, list, and user-card components with responsive styling.

## Concepts learned

- Fetching API data with `useEffect` and cleaning up with `AbortController`.
- Managing loading, error, success, and empty states in React.
- Controlled inputs and derived filtering without duplicating data in state.
- Component composition, accessible status messaging, and responsive CSS.