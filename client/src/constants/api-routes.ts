export const AuthRoutes = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  ADMIN_LOGIN: '/api/auth/admin-login',
  GOOGLE_LOGIN: '/api/auth/login/google',
  REFRESH: '/api/auth/refresh',
  CHECK_AUTH: '/api/auth/check-auth',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  CHANGE_PASSWORD: '/api/auth/change-password',
  LOGOUT: '/api/auth/logout',
  OTP_REQUEST: '/api/auth/otp-request',
  OTP_VERIFY: '/api/auth/otp-verify',
} as const;


export const ClientRoutes = {
  PROFILE: '/api/client/profile',
  PROFILE_AVATAR: '/api/client/profile/avatar',
} as const;