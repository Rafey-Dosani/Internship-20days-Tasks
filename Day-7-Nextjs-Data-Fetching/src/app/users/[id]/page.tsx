import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/users";

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Member profile",
  description: "Contact, address, and company details for a directory member.",
};

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(userId) || userId < 1) {
    notFound();
  }

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="page-shell profile-page">
      <Link className="back-link" href="/users"><span aria-hidden="true">←</span> All people</Link>
      <section className="profile-hero">
        <span className="avatar avatar-large" aria-hidden="true">{initials}</span>
        <div className="profile-heading">
          <p className="eyebrow">COMMUNITY MEMBER · {String(user.id).padStart(2, "0")}</p>
          <h1>{user.name}</h1>
          <p className="username">@{user.username}</p>
        </div>
        <a className="button button-primary email-button" href={`mailto:${user.email}`}>
          Send an email <span aria-hidden="true">↗</span>
        </a>
      </section>

      <div className="profile-grid">
        <section className="profile-card" aria-labelledby="contact-title">
          <p className="eyebrow">SAY HELLO</p>
          <h2 id="contact-title">Contact details</h2>
          <dl className="detail-list">
            <div><dt>Email</dt><dd><a href={`mailto:${user.email}`}>{user.email}</a></dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${user.phone}`}>{user.phone}</a></dd></div>
            <div>
              <dt>Website</dt>
              <dd>
                <a href={`https://${user.website}`} target="_blank" rel="noreferrer">
                  {user.website} <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="profile-card" aria-labelledby="address-title">
          <p className="eyebrow">FIND THEM</p>
          <h2 id="address-title">Address</h2>
          <address className="address-block">
            {user.address.street}, {user.address.suite}
            <br />
            {user.address.city}, {user.address.zipcode}
          </address>
          <p className="geo-detail">
            Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
          </p>
        </section>

        <section className="profile-card company-card" aria-labelledby="company-title">
          <p className="eyebrow">WHAT THEY DO</p>
          <h2 id="company-title">Company</h2>
          <h3>{user.company.name}</h3>
          <blockquote>&ldquo;{user.company.catchPhrase}&rdquo;</blockquote>
          <p className="company-specialty">{user.company.bs}</p>
        </section>
      </div>
    </div>
  );
}

