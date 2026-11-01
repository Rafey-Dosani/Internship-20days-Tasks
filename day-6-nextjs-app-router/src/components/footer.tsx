import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="footer-brand" href="/">
          <span className="brand-mark brand-mark-small" aria-hidden="true">m</span>
          miniportal
        </Link>
        <p>A little directory, built for learning and exploring.</p>
        <span className="footer-credit">Powered by Next.js</span>
      </div>
    </footer>
  );
}
