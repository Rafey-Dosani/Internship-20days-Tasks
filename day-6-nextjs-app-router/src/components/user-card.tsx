import Link from "next/link";
import type { User } from "@/lib/users";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="user-card">
      <div className="user-card-heading">
        <span className="avatar">{initials}</span>
        <span className="user-id">MEMBER {String(user.id).padStart(2, "0")}</span>
      </div>
      <h2>{user.name}</h2>
      <p className="user-username">@{user.username}</p>
      <div className="user-card-meta">
        <span className="meta-label">EMAIL</span>
        <a href={`mailto:${user.email}`}>{user.email}</a>
      </div>
      <div className="company-chip">
        <span className="company-dot" aria-hidden="true" />
        {user.company.name}
      </div>
      <Link className="user-card-link" href={`/users/${user.id}`}>
        View profile <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
