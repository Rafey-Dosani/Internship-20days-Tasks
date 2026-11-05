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
      <div className="user-card-top">
        <span className="avatar" aria-hidden="true">{initials}</span>
        <span className="member-label">MEMBER {String(user.id).padStart(2, "0")}</span>
      </div>
      <h2>{user.name}</h2>
      <p className="username">@{user.username}</p>
      <dl className="card-details">
        <div>
          <dt>Email</dt>
          <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{user.company.name}</dd>
        </div>
      </dl>
      <Link className="profile-link" href={`/users/${user.id}`}>
        View profile <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

