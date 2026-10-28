import UserCard from './UserCard.jsx'

function UserList({ users }) {
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