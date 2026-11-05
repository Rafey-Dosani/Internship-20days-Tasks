"use client";

import { useMemo, useState } from "react";
import type { User } from "@/lib/users";
import UserCard from "@/components/user-card";

interface UserSearchProps {
  users: User[];
}

export default function UserSearch({ users }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase();

    return users.filter((user) =>
      [user.name, user.email, user.username, user.company.name].some((value) =>
        value.toLocaleLowerCase().includes(searchTerm),
      ),
    );
  }, [query, users]);

  return (
    <section className="directory-results" aria-label="User directory">
      <div className="directory-toolbar">
        <label className="search-field">
          <span aria-hidden="true" className="search-icon">⌕</span>
          <span className="visually-hidden">Search by name, email, username, or company</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people or companies..."
          />
        </label>
        <p className="result-count" aria-live="polite">
          <strong>{filteredUsers.length}</strong>{" "}
          {filteredUsers.length === 1 ? "person" : "people"}
        </p>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="user-grid">
          {filteredUsers.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <h2>No people found</h2>
          <p>
            {query.trim()
              ? `There are no matches for "${query.trim()}". Try another search.`
              : "There are no users to display right now."}
          </p>
          {query && (
            <button className="button button-secondary" onClick={() => setQuery("")}>
              Clear search
            </button>
          )}
        </div>
      )}
    </section>
  );
}

