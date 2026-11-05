import type { Metadata } from "next";
import UserSearch from "@/components/user-search";
import { getUsers } from "@/lib/users";

export const metadata: Metadata = {
  title: "Directory",
  description: "Browse and search the people directory.",
};

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">THE COMMUNITY</p>
        <h1>Good people,<br /><span>easy to find.</span></h1>
        <p className="intro-copy">
          Browse the directory and find the details you need. Search by name,
          username, email, or company.
        </p>
      </section>
      <UserSearch users={users} />
    </div>
  );
}

