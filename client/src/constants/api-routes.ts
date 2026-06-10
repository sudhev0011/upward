export const AuthRoutes = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  ADMIN_LOGIN: "/api/auth/admin-login",
  GOOGLE_LOGIN: "/api/auth/login/google",
  REFRESH: "/api/auth/refresh",
  CHECK_AUTH: "/api/auth/check-auth",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  CHANGE_PASSWORD: "/api/auth/change-password",
  LOGOUT: "/api/auth/logout",
  OTP_REQUEST: "/api/auth/otp-request",
  OTP_VERIFY: "/api/auth/otp-verify",
} as const;

export const ClientRoutes = {
  PROFILE: "/api/client/profile",
  PROFILE_UPLOAD_URL: "/api/client/profile-upload-url",
  PROFILE_AVATAR: "/api/client/profile/avatar",
  AVAILABLE_SLOTS: (providerId: string, serviceId: string) =>
    `/api/client/providers/${providerId}/services/${serviceId}/slots`,

  BOOKINGS: "/api/client/bookings",
  BOOKINGS_ONSITE: "/api/client/bookings/onsite",
  BOOKINGS_OFFSITE: "/api/client/bookings/offsite",
  PAYMENT_CREATE_INTENT: "/api/client/payments/create-intent",
  GET_WALLET: "/api/client/wallet"
} as const;

export const ProviderRoutes = {
  PROFILE: "/api/provider/profile",
  PROFILE_UPLOAD_URL: "/api/provider/profile-upload-url",
  KYC_IDENTITY: "/api/provider/kyc/identity",
  KYC_BANK: "/api/provider/kyc/bank",
  KYC_DOCUMENT_UPLOAD: "/api/provider/media/kyc-document",
  GET_KYC_DOCUMENT: "/api/provider/kyc/identity",
  GET_BANK_DOCUMENT: "/api/provider/kyc/bank",
  CREATE_PROVIDE_SERVICE: "/api/provider/providerService",
  GET_ALL_PROVIDER_SERVICE_BY_CATEGORY: "/api/provider/providerServices",
  SET_PROVIDER_SERVICE_PRICE: "/api/provider/providerService",
  DELETE_PROVIDER_SERVICE: "/api/provider/providerService/:id",

  // ─── Availability ────────────────────────────────────────────────────────────
  SET_AVAILABILITY: "/api/provider/availability",
  GET_AVAILABILITY: "/api/provider/availability",

  // ─── Unavailability ──────────────────────────────────────────────────────────
  GET_UNAVAILABILITY: "/api/provider/unavailability",
  CREATE_UNAVAILABILITY: "/api/provider/unavailability",
  DELETE_UNAVAILABILITY: "/api/provider/unavailability/:id",

  // ─── Availability Overrides ──────────────────────────────────────────────────
  SET_AVAILABILITY_OVERRIDE: "/api/provider/availability/overrides",
  GET_AVAILABILITY_OVERRIDES: "/api/provider/availability/overrides",
  DELETE_AVAILABILITY_OVERRIDE: "/api/provider/availability/overrides/:date",

  // ─── Portfolio ───────────────────────────────────────────────────────────────
  GET_PORTFOLIO_UPLOAD_URL: "/api/provider/portfolio/upload-url",
  CREATE_PORTFOLIO_ITEM: "/api/provider/portfolio",
  GET_PORTFOLIO: "/api/provider/portfolio",
  DELETE_PORTFOLIO_ITEM: "/api/provider/portfolio/:id",
  REMOVE_PORTFOLIO_IMAGE: "/api/provider/portfolio/:id/images",
  UPDATE_PORTFOLIO_ITEM: "/api/provider/portfolio/:id",
} as const;

export const AdminRoutes = {
  GET_PROVIDER_PROFILES: "/api/admin/providers",
  GET_PROVIDER_PROFILE_BY_ID: "/api/admin/provider/:id",
  APPROVE_PROVIDER: "/api/admin/provider/approve",
  APPROVE_REJECT: "/api/admin/provider/reject",
  BLOCK_PROVIDER: "/api/admin/provider/block",
  GET_CLIENT_PROFILES: "/api/admin/clients",
  GET_CLIENT_PROFILE_BY_ID: "/api/admin/client/:id",
  BLOCK_CLIENT: "/api/admin/client/block",
  GET_KYC_DOCUMENT: "/api/admin/kyc/identity/:userId",
  CREATE_CATEGORY: "/api/admin/category",
  CREATE_SERVICE: "/api/admin/service",
  DELETE_SERVICE: "/api/admin/service/:serviceId",
  GET_ALL_CATEGORIES: "/api/admin/categories/all",
  UPDATE_CATEGORY: "/api/admin/category/update",
  GET_ALL_PAGINATED_CATEGORIES: "/api/admin/categories",
  GET_ALL_SERVICES: "/api/admin/services/all",
  GET_ALL_PAGINATED_SERVICES: "/api/admin/services",
  TOGGLE_SERVICE: "/api/admin/service/toggle",
  UPDATE_SERVICE: "/api/admin/service/update",
} as const;

export const PublicRoutes = {
  GET_SERVICES: "api/public/services",
  GET_CATEGORIES: "/api/public/categories",
  GET_SERVICES_BY_CATEGORY: "/api/public/services/:categoryId",
  GET_PROVIDERS_BY_CATEGORY: "api/public/providers",
  GET_PROVIDER_PORTFOLIO: "api/public/providers/:providerId/portfolio",
  GET_PROVIDER_AVAILABILITY: "api/public/providers/:providerId/availability",
  GET_PROVIDER_AVAILABILITY_OVERRIDES:
    "api/public/providers/:providerId/availability/overrides",
  GET_PROVIDER_UNAVAILABILITY:
    "api/public/providers/:providerId/unavailability",
  GET_PROVIDER_PROFILE: "api/public/providers/:providerId/profile",
  GET_PROVIDER_ACTIVE_SERVICES: "api/public/providers/:providerId/services",
} as const;

export const LocationRoutes = {
  GET_LOCATION: 'api/location/search',
  GET_LOCATION_DETAILS: 'api/location/details'
} as const;

export const SubscriptionRoutes = {
  ADMIN_PLANS: "/api/subscriptions/admin/plans",
  ADMIN_PLAN_BY_ID: "/api/subscriptions/admin/plans/:id",
  PROVIDER_ACTIVE_PLANS: "/api/subscriptions/provider/active-plans",
  PROVIDER_CHECKOUT: "/api/subscriptions/provider/checkout",
  PROVIDER_STATUS: "/api/subscriptions/provider/my-status",
} as const;

export const ChatRoutes = {
  GET_CONVERSATION: "/api/chat/conversations",
  GET_MESSAGES: "/api/chat/messages/:conversationId",
  FIND_OR_CREATE_CONVERSATION: "/api/chat/conversations",
  RESET_UNREAD_COUNT: "/api/chat/conversations/:conversationId/reset",
  GET_UPLOAD_URL: "/api/chat/presigned-url"

} as const;
