import Link from "next/link";
import FeatureCard from "@/components/feature-card";

const features = [
  {
    number: "01",
    title: "Meet the community",
    description:
      "Browse a directory of people and quickly find the details you need.",
    href: "/users",
    linkLabel: "Explore users",
    icon: "U",
  },
  {
    number: "02",
    title: "A little context",
    description:
      "Learn how this mini portal is built and explore the tools behind it.",
    href: "/about",
    linkLabel: "About the portal",
    icon: "i",
  },
];

export default function Home() {
  return (
    <div className="page-shell home-page">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <p className="eyebrow">YOUR SPACE TO EXPLORE</p>
          <h1>A simpler way to get to know everyone.</h1>
          <p className="welcome-description">
            Welcome to your mini portal: a friendly place to discover the
            community, find useful details, and see modern web development in
            action.
          </p>
          <div className="welcome-actions">
            <Link className="button button-primary" href="/users">
              Browse the directory <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href="/about">
              Learn about the project
            </Link>
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="profile-tile profile-tile-main">
            <span className="avatar avatar-large">M</span>
            <span>
              <strong>People first</strong>
              <small>Everything in one place</small>
            </span>
            <span className="online-dot" />
          </div>
          <div className="profile-tile profile-tile-small">
            <span className="mini-avatar">✦</span>
            <span>Made for exploring</span>
          </div>
        </div>
      </section>

      <section className="section-block" aria-labelledby="quick-links-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START HERE</p>
            <h2 id="quick-links-heading">Your portal at a glance</h2>
          </div>
          <p>Two useful places to begin.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.number} {...feature} />
          ))}
        </div>
      </section>

      <section className="home-note">
        <div className="note-mark" aria-hidden="true">✦</div>
        <div>
          <p className="eyebrow">BUILT TO BE SIMPLE</p>
          <h2>Small directory. Big Next.js ideas.</h2>
          <p>
            Every page is connected through App Router navigation, with data
            rendered on the server and search ready when you are.
          </p>
        </div>
        <Link className="text-link" href="/users">
          See how it works <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
