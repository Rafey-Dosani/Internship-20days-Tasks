import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import UserList from './components/UserList.jsx'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

function App() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await fetch(USERS_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`The server responded with ${response.status}.`)
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('The server returned data in an unexpected format.')
        }

        setUsers(data)
        setStatus('success')
      } catch (error) {
        if (error.name === 'AbortError') return
        setErrorMessage(error.message || 'Please check your connection and try again.')
        setStatus('error')
      }
    }

    fetchUsers()
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