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
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return users.filter((user) =>
      user.name.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query, users]);

  return (
    <div className="directory-content">
      <div className="directory-toolbar">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Search users by name</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name..."
          />
          <span className="search-shortcut" aria-hidden="true">⌘ K</span>
        </label>
        <p className="result-count" aria-live="polite">
          <strong>{filteredUsers.length}</strong>{" "}
          {filteredUsers.length === 1 ? "person" : "people"}
        </p>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <span className="empty-state-icon" aria-hidden="true">⌕</span>
          <h2>No people found</h2>
          <p>
            We couldn&apos;t find anyone named “{query.trim()}”. Try a different
            name or clear your search.
          </p>
          <button className="button button-secondary" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
