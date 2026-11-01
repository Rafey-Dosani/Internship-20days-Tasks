import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Next.js Mini Portal and the technology behind it.",
};

const technologies = [
  {
    name: "Next.js App Router",
    detail: "File-based routes, layouts, loading states, and server rendering.",
    label: "ROUTING",
  },
  {
    name: "React + TypeScript",
    detail: "Reusable components with clear, dependable data types.",
    label: "UI",
  },
  {
    name: "JSONPlaceholder",
    detail: "A public API providing the sample directory and profile data.",
    label: "DATA",
  },
  {
    name: "Plain CSS",
    detail: "Responsive styling and a consistent visual language, no UI kit.",
    label: "DESIGN",
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-intro about-intro">
        <p className="eyebrow">ABOUT THIS PROJECT</p>
        <h1>A small portal with a lot to show.</h1>
        <p>
          Mini Portal is a beginner-friendly directory built to make the
          essentials of the Next.js App Router easy to explore. Browse a
          community, search by name, and open a profile for the full picture.
        </p>
      </section>

      <section className="about-story">
        <div className="story-number">01 <span>— THE PURPOSE</span></div>
        <div className="story-copy">
          <h2>Built for learning by doing.</h2>
          <p>
            Rather than a collection of disconnected examples, this project
            brings routing, server-side data fetching, client-side
            interactivity, and thoughtful page states together in one
            working application. Every part is kept straightforward enough
            to follow and practical enough to build on.
          </p>
          <Link className="text-link" href="/users">
            Explore the directory <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="section-block tech-section" aria-labelledby="tech-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE TOOLKIT</p>
            <h2 id="tech-title">Made with familiar tools</h2>
          </div>
          <p>A focused stack, without extra dependencies.</p>
        </div>
        <div className="technology-grid">
          {technologies.map((technology, index) => (
            <article className="technology-card" key={technology.name}>
              <span className="technology-label">{technology.label}</span>
              <span className="technology-index">0{index + 1}</span>
              <h3>{technology.name}</h3>
              <p>{technology.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
