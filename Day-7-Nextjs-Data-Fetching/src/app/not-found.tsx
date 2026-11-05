import Link from "next/link";

export default function NotFound() {
  return (
    <div className="state-page">
      <div className="state-card">
        <span className="state-icon not-found-icon" aria-hidden="true">?</span>
        <p className="eyebrow">PROFILE NOT FOUND</p>
        <h1>This person isn&apos;t in the directory.</h1>
        <p>The profile may have moved, or the ID may not be valid.</p>
        <Link className="button button-primary" href="/users">Back to the directory</Link>
      </div>
    </div>
  );
}

