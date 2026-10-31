export type DashboardSection = 'overview' | 'users' | 'orders'

export type ActivityStatus = 'Completed' | 'Processing' | 'Pending'

export interface SummaryMetric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: 'users' | 'revenue' | 'orders' | 'active'
}

export interface Activity {
  id: string
  name: string
  email: string
  initials: string
  action: string
  reference: string
  date: string
  status: ActivityStatus
  kind: 'user' | 'order'
}

export interface DashboardData {
  summary: SummaryMetric[]
  activities: Activity[]
}
