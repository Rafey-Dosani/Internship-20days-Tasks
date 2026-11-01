# Next.js Mini Portal

A responsive people directory built with the Next.js App Router, TypeScript, React, plain CSS, and JSONPlaceholder.

## Run the project

From this folder, install the dependencies if needed and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To verify the production build and start it locally:

```bash
npm run build
npm run start
```

Run ESLint with `npm run lint`.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Welcome dashboard and links to the portal features |
| `/about` | Project purpose and technology overview |
| `/users` | Searchable directory loaded from JSONPlaceholder |
| `/users/[id]` | A member's contact, address, and company details |

The directory loads its data from `https://jsonplaceholder.typicode.com/users`. Search filters the loaded list by name in the browser. Unknown or invalid profile IDs use the not-found UI.

## Project structure

```text
src/
  app/
    about/page.tsx         About route
    users/
      [id]/page.tsx        Dynamic profile route
      error.tsx            Directory and profile error boundary
      loading.tsx          Directory and profile loading skeleton
      page.tsx             Server-rendered directory route
    error.tsx              Application route error boundary
    not-found.tsx          Shared 404 and invalid-profile UI
    globals.css            Responsive application styles
    layout.tsx             Shared navigation, page, and footer layout
    page.tsx               Home dashboard
  components/
    feature-card.tsx       Reusable home-page feature card
    footer.tsx             Shared footer
    navbar.tsx             Shared navigation
    user-card.tsx          Reusable directory member card
    user-list.tsx          Directory component boundary
    user-search.tsx        Interactive client-side search and results
  lib/
    users.ts               User types, API fetching, and response validation
```

## App Router concepts used

- **Server Components:** Pages, layouts, `FeatureCard`, `Footer`, `UserList`, and data access in `lib/users.ts` run on the server by default.
- **Client Components:** `UserSearch` uses React state to filter users and display an empty state. Error boundaries are Client Components as required by Next.js. The navigation and other reusable display components remain Server Components.
- **Dynamic routing:** `src/app/users/[id]/page.tsx` maps `/users/1` and other IDs to a profile. It validates the ID, fetches the matching user, and calls `notFound()` when no profile exists.
- **Shared layout:** `src/app/layout.tsx` wraps each route with the common navigation and footer.
- **Loading and errors:** `src/app/users/loading.tsx` provides a skeleton while the directory or profile is loading. Route error boundaries provide a retry action when rendering or API requests fail.
- **Navigation:** Internal links use Next.js `Link`.
