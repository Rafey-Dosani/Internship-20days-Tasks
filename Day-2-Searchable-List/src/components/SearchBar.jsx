function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
      <span className="visually-hidden">Search by name or email</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search people…"
        autoComplete="off"
      />
      <kbd>⌘ K</kbd>
    </label>
  )
}

export default SearchBar