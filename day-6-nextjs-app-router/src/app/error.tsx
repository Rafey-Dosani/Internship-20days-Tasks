"use client";

import { useEffect } from "react";

interface AppErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function AppError({ error, retry }: AppErrorProps) {
  useEffect(() => {
    console.error("The application route failed to render:", error);
  }, [error]);

  return (
    <div className="page-shell state-page">
      <div className="state-card">
        <span className="state-icon state-icon-error" aria-hidden="true">!</span>
        <p className="eyebrow">SOMETHING WENT WRONG</p>
        <h1>That didn&apos;t go as planned.</h1>
        <p>Try again. Your page should be right back.</p>
        <button className="button button-primary" onClick={retry}>
          Try again <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}
