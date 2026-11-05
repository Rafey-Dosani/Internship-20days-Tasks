# Day 7 - Next.js Data Fetching

A responsive user directory built with the Next.js App Router, TypeScript, React, and JSONPlaceholder. Browse user cards, search in the browser, and open complete individual profiles.

## Run the application

Use Node.js 20.9 or later. From this folder, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000); the home route redirects to `/users`.

Useful checks and production commands:

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to the user directory |
| `/users` | Server-fetched, searchable user list |
| `/users/[id]` | Server-fetched user profile; unknown IDs show a not-found page |

## Folder structure

```text
src/
  app/
    users/
      [id]/page.tsx       Dynamic server-rendered profile page
      error.tsx           User route error boundary and retry button
      loading.tsx         Loading skeleton for user routes
      page.tsx            Server-rendered directory page
    globals.css           Responsive styles and loading animations
    layout.tsx             Shared document layout and metadata
    not-found.tsx          Invalid or missing profile state
    page.tsx               Redirects to /users
  components/
    user-card.tsx          Reusable directory card
    user-search.tsx        Client-side search and empty state
  lib/
    users.ts               User interface, validation, and API functions
```

## Server and client rendering

The directory and profile pages are Server Components. `src/lib/users.ts` fetches JSONPlaceholder data on the server, validates the response shape, and returns typed users. The profile page validates the route ID before requesting its data.

`UserSearch` is a small Client Component because typing and filtering need React state. It receives the already-fetched users from the server and searches by name, username, email, or company. Cards and profile routes stay server-rendered; client JavaScript is limited to the interactive search and error boundary.

## Caching and revalidation

Both API fetches explicitly use `next: { revalidate: 300 }`. Next.js may reuse each response for up to five minutes, then refresh it on a later request. This is appropriate for a sample directory whose data changes infrequently and avoids fetching the same data on every page request. The API URL and revalidation duration are centralized in `src/lib/users.ts`.

## Loading, errors, empty results, and missing profiles

- `src/app/users/loading.tsx` renders a responsive card skeleton while user routes are loading.
- `src/app/users/error.tsx` presents a friendly API or rendering failure state. Its **Try again** button invokes the App Router error boundary's `reset()` retry function; failures are also logged in the browser console.
- An empty search result has a message and a **Clear search** action. An empty API list also has an explanatory message.
- Invalid IDs and API `404` responses call `notFound()`, which renders `src/app/not-found.tsx`.
- Non-404 API failures and invalid response data throw an error and are handled by the user-route error boundary.
