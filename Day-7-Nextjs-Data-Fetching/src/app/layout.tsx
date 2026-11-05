import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "People Directory",
    template: "%s | People Directory",
  },
  description: "A searchable directory of people and their profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/users" aria-label="People Directory home">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>people<span className="brand-light"> directory</span></span>
          </Link>
          <Link className="header-link" href="/users">Directory <span aria-hidden="true">↗</span></Link>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Made for finding the people behind the profiles.</p>
          <span>Powered by JSONPlaceholder</span>
        </footer>
      </body>
    </html>
  );
}

