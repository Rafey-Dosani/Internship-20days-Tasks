"use client";

import { useEffect } from "react";

interface UsersErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UsersError({ error, reset }: UsersErrorProps) {
  useEffect(() => {
    console.error("The user directory route failed to render:", error);
  }, [error]);

  return (
    <div className="state-page">
      <div className="state-card">
        <span className="state-icon error-icon" aria-hidden="true">!</span>
        <p className="eyebrow">TEMPORARY SETBACK</p>
        <h1>We couldn&apos;t load these users.</h1>
        <p>Check your connection and try again. The service may be temporarily unavailable.</p>
        <button className="button button-primary" onClick={reset}>
          Try again <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}

