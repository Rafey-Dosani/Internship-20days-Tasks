import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/users", label: "Users" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Mini Portal home">
          <span className="brand-mark" aria-hidden="true">m</span>
          <span>mini<span className="brand-light">portal</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link key={href} className="nav-link" href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/users">
          Meet the community <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
