import type { Metadata } from "next";
import { Suspense } from "react";
import UserList from "@/components/user-list";
import { getUsers } from "@/lib/users";

export const metadata: Metadata = {
  title: "Community",
  description: "Search the Mini Portal community and explore member profiles.",
};

async function UserDirectory() {
  const users = await getUsers();
  return <UserList users={users} />;
}

function DirectoryFallback() {
  return (
    <div className="loading-panel">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Loading the community directory...</p>
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="page-shell directory-page">
      <section className="page-intro directory-intro">
        <p className="eyebrow">THE COMMUNITY</p>
        <h1>Good people, easy to find.</h1>
        <p>
          Get to know the community. Search by name, then open a profile for
          their contact details and more.
        </p>
      </section>
      <Suspense fallback={<DirectoryFallback />}>
        <UserDirectory />
      </Suspense>
    </div>
  );
}
