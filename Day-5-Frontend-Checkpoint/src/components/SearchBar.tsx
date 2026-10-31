import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function SearchBar({ value, onChange, label = 'Search activity by name or email' }: SearchBarProps) {
  return (
    <label className="table-search">
      <Search size={16} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="Search..."
        autoComplete="off"
      />
    </label>
  )
}

export default SearchBar
