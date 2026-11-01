import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getUserById } from "@/lib/users";

export const metadata: Metadata = {
  title: "Member profile",
  description: "Contact details, address, and company information for a community member.",
};

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function UserProfile({ params }: UserDetailsPageProps) {
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
      <Link className="back-link" href="/users">
        <span aria-hidden="true">←</span> Back to the community
      </Link>
      <section className="profile-hero">
        <span className="avatar avatar-profile">{initials}</span>
        <div className="profile-heading">
          <p className="eyebrow">COMMUNITY MEMBER · {String(user.id).padStart(2, "0")}</p>
          <h1>{user.name}</h1>
          <p className="profile-username">@{user.username}</p>
        </div>
        <a className="button button-primary profile-email" href={`mailto:${user.email}`}>
          Send an email <span aria-hidden="true">↗</span>
        </a>
      </section>

      <div className="profile-grid">
        <section className="profile-card" aria-labelledby="contact-title">
          <div className="profile-card-heading">
            <span className="profile-card-icon" aria-hidden="true">@</span>
            <div>
              <p className="eyebrow">SAY HELLO</p>
              <h2 id="contact-title">Contact details</h2>
            </div>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd><a href={`tel:${user.phone}`}>{user.phone}</a></dd>
            </div>
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
          <div className="profile-card-heading">
            <span className="profile-card-icon" aria-hidden="true">⌖</span>
            <div>
              <p className="eyebrow">FIND THEM</p>
              <h2 id="address-title">Address</h2>
            </div>
          </div>
          <address className="address-block">
            {user.address.street}, {user.address.suite}
            <br />
            {user.address.city}, {user.address.zipcode}
          </address>
          <p className="geo-detail">
            Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
          </p>
        </section>

        <section className="profile-card company-profile-card" aria-labelledby="company-title">
          <div className="profile-card-heading">
            <span className="profile-card-icon" aria-hidden="true">✦</span>
            <div>
              <p className="eyebrow">WHAT THEY DO</p>
              <h2 id="company-title">Company</h2>
            </div>
          </div>
          <h3 className="company-name">{user.company.name}</h3>
          <blockquote>&ldquo;{user.company.catchPhrase}&rdquo;</blockquote>
          <p className="company-specialty">{user.company.bs}</p>
        </section>
      </div>
    </div>
  );
}

function ProfileFallback() {
  return (
    <div className="loading-panel profile-loading">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Loading member profile...</p>
    </div>
  );
}

export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <UserProfile params={params} />
    </Suspense>
  );
}
