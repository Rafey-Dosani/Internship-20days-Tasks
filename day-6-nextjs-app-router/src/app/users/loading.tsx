export default function UsersLoading() {
  return (
    <div className="page-shell directory-page" aria-label="Loading community">
      <section className="page-intro directory-intro">
        <p className="eyebrow">THE COMMUNITY</p>
        <h1>Good people, easy to find.</h1>
        <p>Loading the community directory...</p>
      </section>
      <div className="user-grid loading-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="user-card skeleton-card" key={index}>
            <span className="skeleton-line skeleton-avatar" />
            <span className="skeleton-line skeleton-title" />
            <span className="skeleton-line skeleton-short" />
            <span className="skeleton-line skeleton-wide" />
            <span className="skeleton-line skeleton-chip" />
          </div>
        ))}
      </div>
    </div>
  );
}
