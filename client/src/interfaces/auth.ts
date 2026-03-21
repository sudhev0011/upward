import { UserRole } from '@/constants/user-role'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  roles: UserRole[]
}

export interface GoogleLoginPayload {
  idToken: string
}

export interface VerifyOtpPayload{
  email: string
  code: string
}

export interface ResetPasswordPayload{
  token: string
  newPassword: string
}

export interface AuthResponseData {
  id: string
  name: string
  email: string
  roles: UserRole[]
  avatar?: string
  isVerified: boolean
  isBlocked: boolean
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{ field: string; message: string }>
}