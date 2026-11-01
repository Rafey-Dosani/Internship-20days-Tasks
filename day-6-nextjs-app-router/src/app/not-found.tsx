import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell state-page">
      <div className="state-card">
        <span className="not-found-code">404</span>
        <p className="eyebrow">PAGE NOT FOUND</p>
        <h1>Looks like this page wandered off.</h1>
        <p>
          The address may be incorrect, or this profile may no longer be
          available.
        </p>
        <Link className="button button-primary" href="/">
          Back to home <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
