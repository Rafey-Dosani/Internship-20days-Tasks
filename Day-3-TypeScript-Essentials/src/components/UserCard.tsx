import type { User } from '../types/user'

const avatarColors = ['coral', 'sage', 'blue', 'yellow', 'rose', 'mint'] as const
type AvatarColor = (typeof avatarColors)[number]

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
  const color: AvatarColor = avatarColors[(user.id - 1) % avatarColors.length]

  return (
    <li className="user-card">
      <div className="card-topline">
        <div className={`avatar avatar-${color}`} aria-hidden="true">{initials}</div>
        <span className="user-number">#{String(user.id).padStart(2, '0')}</span>
      </div>
      <h3>{user.name}</h3>
      <a className="user-email" href={`mailto:${user.email}`}>{user.email}</a>
      <div className="card-divider" />
      <div className="user-details">
        <div>
          <span className="detail-label">PHONE</span>
          <span className="detail-value">{user.phone}</span>
        </div>
        <div>
          <span className="detail-label">CITY</span>
          <span className="detail-value">{user.address.city || 'Not listed'}</span>
        </div>
      </div>
    </li>
  )
}

export default UserCard
