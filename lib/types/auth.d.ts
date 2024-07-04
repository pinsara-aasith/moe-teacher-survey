type User = {
  _id: string
  school?: string
  email?: string
  name: string
  password: string
  role: string
  refreshToken: string
}

export type UserSession = Omit<User, 'password' | 'refreshToken'>
