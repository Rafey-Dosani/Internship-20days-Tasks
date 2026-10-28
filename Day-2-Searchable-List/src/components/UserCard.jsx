const avatarColors = ['coral', 'sage', 'blue', 'yellow', 'rose', 'mint']

function UserCard({ user }) {
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const color = avatarColors[(user.id - 1) % avatarColors.length]

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
          <span className="detail-value">{user.address?.city || 'Not listed'}</span>
        </div>
      </div>
    </li>
  )
}

export default UserCard