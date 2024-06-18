type UserType = 'school-admin' | 'system-admin'

interface LoginData {}

interface SchoolAdminLoginData extends LoginData {
  province: string;
  schoolCode: string;
  password: string;
}

interface SystemAdminLoginData extends LoginData {
  email: string;
  password: string;
}
