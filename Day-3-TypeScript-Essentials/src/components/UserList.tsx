import type { User } from '../types/user'
import UserCard from './UserCard'

interface UserListProps {
  users: User[]
}

function UserList({ users }: UserListProps) {
  return (
    <div className="results-wrap" aria-live="polite">
      <div className="results-caption">
        <span>ALL PEOPLE</span>
        <span>{String(users.length).padStart(2, '0')} RESULTS</span>
      </div>
      <ul className="user-grid">
        {users.map((user) => <UserCard key={user.id} user={user} />)}
      </ul>
    </div>
  )
}

export default UserList
