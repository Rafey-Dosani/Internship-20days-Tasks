function Header({ userCount }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="People Index home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>people<span className="brand-light">index</span></span>
      </a>
      <div className="header-meta">
        <span className="online-dot" aria-hidden="true" />
        <span>{userCount ? `${userCount} profiles` : 'Directory'}</span>
      </div>
    </header>
  )
}

export default Header