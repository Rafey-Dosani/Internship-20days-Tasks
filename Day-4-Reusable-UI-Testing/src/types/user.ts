export interface User {
  id: string
  name: string
  email: string
  department: string
}

export type NewUser = Omit<User, 'id'>
