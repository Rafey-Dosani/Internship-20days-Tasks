import { useMemo, useState } from 'react'
import AddUserForm from './components/AddUserForm'
import Button from './components/Button'
import Input from './components/Input'
import Table, { type TableColumn } from './components/Table'
import type { NewUser, User } from './types/user'

const initialUsers: User[] = [
  { id: '1', name: 'Ava Patel', email: 'ava.patel@example.com', department: 'Product' },
  { id: '2', name: 'Marcus Green', email: 'marcus.green@example.com', department: 'Engineering' },
  { id: '3', name: 'Sofia Chen', email: 'sofia.chen@example.com', department: 'Design' },
  { id: '4', name: 'Noah Williams', email: 'noah.williams@example.com', department: 'People' },
]

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'department', header: 'Department' },
]

function App() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [query, setQuery] = useState('')
  const [nextId, setNextId] = useState(initialUsers.length + 1)

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [query, users])

  function addUser(newUser: NewUser) {
    setUsers((currentUsers) => [...currentUsers, { ...newUser, id: String(nextId) }])
    setNextId((currentId) => currentId + 1)
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="People Index home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>people<span className="brand-light">index</span></span>
        </a>
        <span className="header-meta">{users.length} team members</span>
      </header>

      <section className="page-heading" aria-labelledby="page-title">
        <p className="eyebrow">TEAM DIRECTORY</p>
        <h1 id="page-title">User management</h1>
        <p className="page-description">Keep your team information organized and up to date.</p>
      </section>

      <section className="workspace" aria-label="Manage users">
        <section className="directory panel" aria-labelledby="directory-title">
          <div className="panel-heading">
            <div>
              <h2 id="directory-title">Team members</h2>
              <p>{filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} shown</p>
            </div>
            <span className="count-badge" aria-label={`${users.length} total users`}>{users.length}</span>
          </div>
          <div className="search-wrap">
            <Input
              id="user-search"
              name="search"
              type="search"
              label="Search users"
              placeholder="Search by name or email"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              autoComplete="off"
            />
          </div>
          <div aria-live="polite" aria-atomic="true">
            <Table
              caption="User directory"
              columns={columns}
              data={filteredUsers}
              emptyMessage="No users match your search."
            />
            {filteredUsers.length === 0 && query.trim() !== '' && (
              <p className="visually-hidden" role="status">No users match your search.</p>
            )}
          </div>
        </section>

        <section className="add-panel panel" aria-labelledby="add-title">
          <div className="panel-heading">
            <div>
              <h2 id="add-title">Add a user</h2>
              <p>Enter the details for a new team member.</p>
            </div>
          </div>
          <AddUserForm onAddUser={addUser} />
        </section>
      </section>

      <footer className="page-footer">
        <span>PEOPLE INDEX</span>
        <Button type="button" variant="secondary" className="footer-button" aria-label="Help">
          Help
        </Button>
      </footer>
    </main>
  )
}

export default App
