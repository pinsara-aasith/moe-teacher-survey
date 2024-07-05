type User = {
  _id: string
  school?: ISchool | string
  email?: string
  name: string
  password: string
  role: string
  refreshToken: string
}

export type UserSession = Omit<User, 'password' | 'refreshToken'>
