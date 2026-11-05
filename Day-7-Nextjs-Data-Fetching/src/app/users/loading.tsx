export default function UsersLoading() {
  return (
    <div className="page-shell" aria-label="Loading user directory">
      <section className="page-intro">
        <p className="eyebrow">THE COMMUNITY</p>
        <h1>Good people,<br /><span>easy to find.</span></h1>
        <p className="intro-copy">Loading the directory...</p>
      </section>
      <div className="user-grid loading-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="user-card skeleton-card" key={index}>
            <span className="skeleton skeleton-avatar" />
            <span className="skeleton skeleton-title" />
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

