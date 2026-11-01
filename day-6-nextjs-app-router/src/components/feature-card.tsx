import Link from "next/link";

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  icon: string;
}

export default function FeatureCard({
  number,
  title,
  description,
  href,
  linkLabel,
  icon,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <span className="feature-icon" aria-hidden="true">{icon}</span>
        <span className="feature-number">{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="feature-link" href={href}>
        {linkLabel} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
