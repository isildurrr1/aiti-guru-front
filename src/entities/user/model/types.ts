export interface IUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface ILoginRequest {
  username: string
  password: string
}

export interface ILoginResponse extends IUser {
  accessToken: string
  refreshToken: string
}
