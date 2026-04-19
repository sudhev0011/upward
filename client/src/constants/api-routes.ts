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
  PROFILE_UPLOAD_URL: '/api/client/profile-upload-url',
  PROFILE_AVATAR: '/api/client/profile/avatar',
} as const;

export const ProviderRoutes = {
  PROFILE: '/api/provider/profile',
  PROFILE_UPLOAD_URL: '/api/provider/profile-upload-url',
  KYC_IDENTITY: '/api/provider/kyc/identity',
  KYC_BANK: '/api/provider/kyc/bank',
  KYC_DOCUMENT_UPLOAD: '/api/provider/media/kyc-document',
  GET_KYC_DOCUMENT: '/api/provider/kyc/identity',
  GET_BANK_DOCUMENT: '/api/provider/kyc/bank'
} as const;

export const AdminRoutes = {
  GET_PROVIDER_PROFILES: '/api/admin/providers',
  GET_PROVIDER_PROFILE_BY_ID: '/api/admin/provider/:id',
  APPROVE_PROVIDER: '/api/admin/provider/approve',
  APPROVE_REJECT: '/api/admin/provider/reject',
  BLOCK_PROVIDER: '/api/admin/provider/block',
  GET_CLIENT_PROFILES: '/api/admin/clients',
  GET_CLIENT_PROFILE_BY_ID: '/api/admin/client/:id',
  BLOCK_CLIENT: '/api/admin/client/block',
  GET_KYC_DOCUMENT: '/api/admin/kyc/identity/:userId'

} as const;