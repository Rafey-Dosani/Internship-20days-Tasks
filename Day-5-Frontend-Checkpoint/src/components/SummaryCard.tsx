import { ArrowDownRight, ArrowUpRight, CreditCard, ShoppingBag, UserRound, UsersRound } from 'lucide-react'
import type { SummaryMetric } from '../types'

interface SummaryCardProps {
  metric: SummaryMetric
}

const metricIcons = {
  users: UsersRound,
  revenue: CreditCard,
  orders: ShoppingBag,
  active: UserRound,
}

function SummaryCard({ metric }: SummaryCardProps) {
  const Icon = metricIcons[metric.icon]
  const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight

  return (
    <article className="summary-card">
      <div className="summary-card-top">
        <span className={`metric-icon metric-icon-${metric.icon}`} aria-hidden="true">
          <Icon size={19} strokeWidth={1.8} />
        </span>
        <span className="metric-period">This month</span>
      </div>
      <p className="metric-label">{metric.label}</p>
      <p className="metric-value">{metric.value}</p>
      <p className={`metric-change metric-change-${metric.trend}`}>
        <TrendIcon size={15} strokeWidth={2} aria-hidden="true" />
        <span>{metric.change}</span>
      </p>
    </article>
  )
}

export default SummaryCard
