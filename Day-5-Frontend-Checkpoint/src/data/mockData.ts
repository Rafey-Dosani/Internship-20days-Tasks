import type { DashboardData } from '../types'

const dashboardData: DashboardData = {
  summary: [
    { label: 'Total users', value: '12,486', change: '+12.8% from last month', trend: 'up', icon: 'users' },
    { label: 'Revenue', value: '$48,294', change: '+8.2% from last month', trend: 'up', icon: 'revenue' },
    { label: 'Orders', value: '1,842', change: '+5.4% from last month', trend: 'up', icon: 'orders' },
    { label: 'Active users', value: '68.4%', change: '-2.1% from last month', trend: 'down', icon: 'active' },
  ],
  activities: [
    {
      id: 'ACT-1048',
      name: 'Olivia Rhye',
      email: 'olivia.rhye@example.com',
      initials: 'OR',
      action: 'Placed a new order',
      reference: 'ORD-2408',
      date: 'Oct 26, 2026',
      status: 'Completed',
      kind: 'order',
    },
    {
      id: 'ACT-1047',
      name: 'Phoenix Baker',
      email: 'phoenix.baker@example.com',
      initials: 'PB',
      action: 'Created an account',
      reference: 'USR-8392',
      date: 'Oct 26, 2026',
      status: 'Completed',
      kind: 'user',
    },
    {
      id: 'ACT-1046',
      name: 'Lana Steiner',
      email: 'lana.steiner@example.com',
      initials: 'LS',
      action: 'Placed a new order',
      reference: 'ORD-2407',
      date: 'Oct 25, 2026',
      status: 'Processing',
      kind: 'order',
    },
    {
      id: 'ACT-1045',
      name: 'Demi Wilkinson',
      email: 'demi.wilkinson@example.com',
      initials: 'DW',
      action: 'Created an account',
      reference: 'USR-8391',
      date: 'Oct 25, 2026',
      status: 'Completed',
      kind: 'user',
    },
    {
      id: 'ACT-1044',
      name: 'Candice Wu',
      email: 'candice.wu@example.com',
      initials: 'CW',
      action: 'Placed a new order',
      reference: 'ORD-2406',
      date: 'Oct 24, 2026',
      status: 'Pending',
      kind: 'order',
    },
    {
      id: 'ACT-1043',
      name: 'Natali Craig',
      email: 'natali.craig@example.com',
      initials: 'NC',
      action: 'Created an account',
      reference: 'USR-8390',
      date: 'Oct 23, 2026',
      status: 'Completed',
      kind: 'user',
    },
    {
      id: 'ACT-1042',
      name: 'Drew Cano',
      email: 'drew.cano@example.com',
      initials: 'DC',
      action: 'Placed a new order',
      reference: 'ORD-2405',
      date: 'Oct 22, 2026',
      status: 'Processing',
      kind: 'order',
    },
  ],
}

export async function loadDashboardData(): Promise<DashboardData> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350))
  return dashboardData
}
