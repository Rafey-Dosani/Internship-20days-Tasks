import { useEffect, useMemo, useState } from 'react'
import ActivityTable from './components/ActivityTable'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import SummaryCard from './components/SummaryCard'
import { loadDashboardData } from './data/mockData'
import type { DashboardData, DashboardSection } from './types'

const sectionCopy: Record<DashboardSection, { title: string; description: string }> = {
  overview: {
    title: 'Overview',
    description: 'Here’s what’s happening with your business today.',
  },
  users: {
    title: 'Users',
    description: 'Keep up with the latest activity from your customers.',
  },
  orders: {
    title: 'Orders',
    description: 'Review recent orders and their fulfillment status.',
  },
}

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let isCurrentRequest = true
    loadDashboardData()
      .then((data) => {
        if (!isCurrentRequest) return
        setDashboard(data)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong while loading the dashboard.',
        )
        setStatus('error')
      })

    return () => {
      isCurrentRequest = false
    }
  }, [retryCount])

  useEffect(() => {
    if (!menuOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const visibleActivities = useMemo(() => {
    if (!dashboard) return []

    const sectionActivities = dashboard.activities.filter((activity) => {
      if (activeSection === 'users') return activity.kind === 'user'
      if (activeSection === 'orders') return activity.kind === 'order'
      return true
    })
    const normalizedQuery = query.trim().toLocaleLowerCase()

    if (!normalizedQuery) return sectionActivities
    return sectionActivities.filter((activity) =>
      `${activity.name} ${activity.email}`.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [activeSection, dashboard, query])

  const copy = sectionCopy[activeSection]

  function selectSection(section: DashboardSection) {
    setActiveSection(section)
    setMenuOpen(false)
  }

  function retryLoading() {
    setErrorMessage('')
    setStatus('loading')
    setRetryCount((count) => count + 1)
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <Sidebar
        activeSection={activeSection}
        isOpen={menuOpen}
        onSelect={selectSection}
        onClose={() => setMenuOpen(false)}
      />

      <div className="main-shell">
        <Header
          query={query}
          onQueryChange={setQuery}
          onMenuToggle={() => setMenuOpen((isOpen) => !isOpen)}
          menuOpen={menuOpen}
        />

        <main className="dashboard-content">
          <section className="welcome-section" aria-labelledby="page-title">
            <div>
              <p className="eyebrow">MONDAY, OCTOBER 26, 2026</p>
              <h1 id="page-title">{copy.title}</h1>
              <p className="welcome-description">{copy.description}</p>
            </div>
            <div className="welcome-date" aria-label="Reporting period: October 20 to October 26">
              <span className="date-dot" aria-hidden="true" />
              <span>Oct 20 – Oct 26, 2026</span>
            </div>
          </section>

          {status === 'loading' && (
            <div className="state-panel loading-panel" role="status" aria-live="polite">
              <span className="spinner" aria-hidden="true" />
              <span>Loading your dashboard…</span>
            </div>
          )}

          {status === 'error' && (
            <section className="state-panel error-panel" role="alert">
              <div className="state-icon" aria-hidden="true">!</div>
              <h2>We couldn’t load your dashboard</h2>
              <p>{errorMessage}</p>
              <button
                className="retry-button"
                type="button"
                onClick={retryLoading}
              >
                Try again
              </button>
            </section>
          )}

          {status === 'success' && dashboard && (
            <>
              <section className="summary-grid" aria-label="Business summary">
                {dashboard.summary.map((metric) => (
                  <SummaryCard key={metric.label} metric={metric} />
                ))}
              </section>

              <section className="activity-section" aria-labelledby="activity-title">
                <div className="section-heading">
                  <div>
                    <h2 id="activity-title">
                      {activeSection === 'overview' ? 'Recent activity' : `Recent ${activeSection}`}
                    </h2>
                    <p>
                      {activeSection === 'overview'
                        ? 'Keep track of what’s happening across your store.'
                        : `A closer look at your latest ${activeSection}.`}
                    </p>
                  </div>
                  <span className="activity-count">
                    {visibleActivities.length} {visibleActivities.length === 1 ? 'result' : 'results'}
                  </span>
                </div>

                <ActivityTable
                  activities={visibleActivities}
                  searchQuery={query}
                  onSearchChange={setQuery}
                  activeSection={activeSection}
                />
              </section>
              <footer className="page-footer">
                <span>Updated just now</span>
                <span>© 2026 Northstar Commerce</span>
              </footer>
            </>
          )}

          {status === 'error' && (
            <footer className="page-footer error-footer">
              <span>Dashboard data is temporarily unavailable.</span>
              <span>© 2026 Northstar Commerce</span>
            </footer>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
