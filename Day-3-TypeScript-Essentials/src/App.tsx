import { useEffect, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import UserList from './components/UserList'
import { isUser, type User } from './types/user'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'
type DirectoryStatus = 'loading' | 'error' | 'success'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [query, setQuery] = useState<string>('')
  const [status, setStatus] = useState<DirectoryStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [retryCount, setRetryCount] = useState<number>(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers(): Promise<void> {
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await fetch(USERS_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`The server responded with ${response.status}.`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every(isUser)) {
          throw new Error('The server returned data in an unexpected format.')
        }

        setUsers(data)
        setStatus('success')
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Please check your connection and try again.')
        setStatus('error')
      }
    }

    void fetchUsers()
    return () => controller.abort()
  }, [retryCount])

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filteredUsers = users.filter((user) => {
    if (!normalizedQuery) return true
    return `${user.name} ${user.email}`.toLocaleLowerCase().includes(normalizedQuery)
  })

  return (
    <main className="page-shell">
      <Header userCount={users.length} />

      <section className="directory" aria-labelledby="directory-title">
        <div className="directory-heading">
          <div>
            <p className="eyebrow">THE DIRECTORY</p>
            <h2 id="directory-title">Find your people.</h2>
          </div>
          <p className="directory-note">Search by name or email address</p>
        </div>

        <SearchBar value={query} onChange={setQuery} />

        {status === 'loading' && (
          <div className="status-panel" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <p>Loading the directory…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="status-panel error-panel" role="alert">
            <span className="status-symbol" aria-hidden="true">!</span>
            <h3>We couldn’t load the directory</h3>
            <p>{errorMessage}</p>
            <button className="retry-button" onClick={() => setRetryCount((count) => count + 1)}>
              Try again
            </button>
          </div>
        )}

        {status === 'success' && filteredUsers.length > 0 && (
          <UserList users={filteredUsers} />
        )}

        {status === 'success' && filteredUsers.length === 0 && (
          <div className="status-panel empty-panel" role="status">
            <span className="status-symbol" aria-hidden="true">?</span>
            <h3>No matching people</h3>
            <p>Try a different name or email address.</p>
          </div>
        )}
      </section>

      <footer className="page-footer">
        <span>PEOPLE INDEX</span>
        <span>Public directory · JSONPlaceholder</span>
      </footer>
    </main>
  )
}

export default App
