import {
  BarChart3,
  ChevronLeft,
  CircleHelp,
  LayoutDashboard,
  Package,
  Settings,
  UsersRound,
  X,
} from 'lucide-react'
import type { DashboardSection } from '../types'

interface SidebarProps {
  activeSection: DashboardSection
  isOpen: boolean
  onSelect: (section: DashboardSection) => void
  onClose: () => void
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: UsersRound, count: '12.4k' },
  { id: 'orders', label: 'Orders', icon: Package, count: '1,842' },
] satisfies Array<{
  id: DashboardSection
  label: string
  icon: typeof LayoutDashboard
  count?: string
}>

function Sidebar({ activeSection, isOpen, onSelect, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-brand-row">
        <a className="brand" href="#overview" onClick={() => onSelect('overview')}>
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-name">northstar<span>.</span></span>
        </a>
        <button className="sidebar-close" type="button" aria-label="Close navigation menu" onClick={onClose}>
          <X size={19} aria-hidden="true" />
        </button>
      </div>

      <div className="workspace-switcher">
        <span className="workspace-avatar" aria-hidden="true">N</span>
        <span className="workspace-label">
          <strong>Northstar Co.</strong>
          <span>Free plan</span>
        </span>
        <ChevronLeft className="workspace-chevron" size={16} aria-hidden="true" />
      </div>

      <p className="nav-label">WORKSPACE</p>
      <nav className="primary-nav">
        {navigationItems.map(({ id, label, icon: Icon, count }) => (
          <button
            className={`nav-item${activeSection === id ? ' nav-item-active' : ''}`}
            key={id}
            type="button"
            aria-current={activeSection === id ? 'page' : undefined}
            onClick={() => onSelect(id)}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
            {count && <span className="nav-count">{count}</span>}
          </button>
        ))}
      </nav>

      <p className="nav-label tools-label">TOOLS</p>
      <nav className="primary-nav" aria-label="Tools">
        <button className="nav-item nav-item-muted" type="button" disabled>
          <BarChart3 size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>Reports</span>
          <span className="soon-tag">Soon</span>
        </button>
        <button className="nav-item nav-item-muted" type="button" disabled>
          <Settings size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon"><CircleHelp size={17} aria-hidden="true" /></span>
          <span><strong>Need a hand?</strong><small>Visit our help center</small></span>
          <a href="mailto:support@northstar.example" aria-label="Email the support team">↗</a>
        </div>
        <div className="sidebar-user">
          <span className="profile-avatar sidebar-profile" aria-hidden="true">JD</span>
          <span className="sidebar-user-copy"><strong>Jordan Davis</strong><small>jordan@northstar.co</small></span>
          <span className="user-menu-dots" aria-hidden="true">•••</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
