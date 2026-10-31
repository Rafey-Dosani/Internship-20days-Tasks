import { Menu, Search, X } from 'lucide-react'

interface HeaderProps {
  query: string
  onQueryChange: (value: string) => void
  onMenuToggle: () => void
  menuOpen: boolean
}

function Header({ query, onQueryChange, onMenuToggle, menuOpen }: HeaderProps) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <label className="global-search">
        <Search size={17} aria-hidden="true" />
        <span className="visually-hidden">Search users by name or email</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder="Search users by name or email..."
          autoComplete="off"
        />
      </label>

      <div className="topbar-right">
        <span className="topbar-greeting">Good morning, Jordan</span>
        <span className="profile-avatar topbar-avatar" aria-label="Jordan Davis">JD</span>
      </div>
    </header>
  )
}

export default Header
