import { Search } from 'lucide-react'
import type { Activity, DashboardSection } from '../types'
import SearchBar from './SearchBar'

interface ActivityTableProps {
  activities: Activity[]
  searchQuery: string
  onSearchChange: (value: string) => void
  activeSection: DashboardSection
}

function ActivityTable({ activities, searchQuery, onSearchChange, activeSection }: ActivityTableProps) {
  const emptyMessage = searchQuery.trim()
    ? 'No people match your search. Try another name or email.'
    : activeSection === 'users'
      ? 'No user activity to show yet.'
      : activeSection === 'orders'
        ? 'No orders to show yet.'
        : 'There’s no recent activity yet.'

  return (
    <>
      <div className="table-toolbar">
        <span className="table-period"><span className="period-dot" aria-hidden="true" /> Last 7 days</span>
        <SearchBar value={searchQuery} onChange={onSearchChange} label="Search activity" />
      </div>
      <div className="activity-table-wrap">
        <table className="activity-table">
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Activity</th>
              <th scope="col" className="date-column">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? activities.map((activity, index) => (
              <tr key={activity.id} style={{ animationDelay: `${index * 35}ms` }}>
                <td>
                  <div className="customer-cell">
                    <span className={`customer-avatar avatar-tone-${index % 5}`} aria-hidden="true">
                      {activity.initials}
                    </span>
                    <span className="customer-copy">
                      <strong>{activity.name}</strong>
                      <span>{activity.email}</span>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="activity-copy">{activity.action}</span>
                  <span className="activity-reference">{activity.reference}</span>
                </td>
                <td className="date-column"><time>{activity.date}</time></td>
                <td>
                  <span className={`status-badge status-${activity.status.toLowerCase()}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {activity.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="empty-cell" colSpan={4}>
                  <span className="empty-icon"><Search size={18} aria-hidden="true" /></span>
                  <strong>No activity found</strong>
                  <span>{emptyMessage}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ActivityTable
