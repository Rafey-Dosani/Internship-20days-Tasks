import UserSearch from "@/components/user-search";
import type { User } from "@/lib/users";

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return <UserSearch users={users} />;
}
