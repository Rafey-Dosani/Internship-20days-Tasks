"use client";

import { useEffect } from "react";

interface UsersErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function UsersError({ error, retry }: UsersErrorProps) {
  useEffect(() => {
    console.error("The community route failed to render:", error);
  }, [error]);

  return (
    <div className="page-shell state-page">
      <div className="state-card">
        <span className="state-icon state-icon-error" aria-hidden="true">!</span>
        <p className="eyebrow">A TEMPORARY SETBACK</p>
        <h1>We couldn&apos;t load the community.</h1>
        <p>
          The directory is unavailable right now. Check your connection and
          try again in a moment.
        </p>
        <button className="button button-primary" onClick={retry}>
          Try again <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}
