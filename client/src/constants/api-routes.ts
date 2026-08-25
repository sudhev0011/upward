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
  PROFILE: "/api/clients/me/profile",
  PROFILE_UPLOAD_URL: "/api/clients/me/profile-upload-url",
  PROFILE_AVATAR: "/api/clients/me/profile/avatar",
  
  AVAILABLE_SLOTS: (providerId: string, serviceId: string) =>
    `/api/providers/${providerId}/services/${serviceId}/slots`,

  BOOKINGS: "/api/bookings",
  BOOKINGS_ONSITE: "/api/bookings/onsite",
  BOOKINGS_OFFSITE: "/api/bookings/offsite",
  
  PAYMENT_CREATE_INTENT: "/api/payments/create-intent",
  GET_WALLET: "/api/wallets/me",
  PAYMENT_REMAINING_INTENT: "/api/payments/remaining-intent",

  CLIENT_COMPLETE_BOOKING: (bookingId: string) =>
    `/api/bookings/${bookingId}/client-complete`,

  RESCHEDULE_BOOKING_ONSITE: (bookingId: string) =>
    `/api/bookings/${bookingId}/reschedule/onsite`,

  RESCHEDULE_BOOKING_OFFSITE: (bookingId: string) =>
    `/api/bookings/${bookingId}/reschedule/offsite`,

  GET_DASHBOARD_STATS: "/api/dashboards/client/stats",
} as const;

export const ProviderRoutes = {
  PROFILE: "/api/providers/me/profile",
  PROFILE_UPLOAD_URL: "/api/providers/me/profile-upload-url",
  
  KYC_IDENTITY: "/api/providers/me/kyc/identity",
  KYC_BANK: "/api/providers/me/kyc/bank",
  KYC_DOCUMENT_UPLOAD: "/api/providers/me/media/kyc-document",
  GET_KYC_DOCUMENT: "/api/providers/me/kyc/identity",
  GET_BANK_DOCUMENT: "/api/providers/me/kyc/bank",
  
  CREATE_PROVIDE_SERVICE: "/api/providers/me/services",
  GET_ALL_PROVIDER_SERVICE_BY_CATEGORY: "/api/providers/me/services",
  SET_PROVIDER_SERVICE_PRICE: "/api/providers/me/services",
  DELETE_PROVIDER_SERVICE: "/api/providers/me/services/:id",

  // ─── Availability ────────────────────────────────────────────────────────────
  SET_AVAILABILITY: "/api/providers/me/availability",
  GET_AVAILABILITY: "/api/providers/me/availability",

  // ─── Unavailability ──────────────────────────────────────────────────────────
  GET_UNAVAILABILITY: "/api/providers/me/unavailability",
  CREATE_UNAVAILABILITY: "/api/providers/me/unavailability",
  DELETE_UNAVAILABILITY: "/api/providers/me/unavailability/:id",

  // ─── Availability Overrides ──────────────────────────────────────────────────
  SET_AVAILABILITY_OVERRIDE: "/api/providers/me/availability/overrides",
  GET_AVAILABILITY_OVERRIDES: "/api/providers/me/availability/overrides",
  DELETE_AVAILABILITY_OVERRIDE: "/api/providers/me/availability/overrides/:date",

  // ─── Portfolio ───────────────────────────────────────────────────────────────
  GET_PORTFOLIO_UPLOAD_URL: "/api/providers/me/portfolio/upload-url",
  CREATE_PORTFOLIO_ITEM: "/api/providers/me/portfolio",
  GET_PORTFOLIO: "/api/providers/me/portfolio",
  DELETE_PORTFOLIO_ITEM: "/api/providers/me/portfolio/:id",
  REMOVE_PORTFOLIO_IMAGE: "/api/providers/me/portfolio/:id/images",
  UPDATE_PORTFOLIO_ITEM: "/api/providers/me/portfolio/:id",

  PROVIDER_COMPLETE_BOOKING: (bookingId: string) =>
    `/api/bookings/${bookingId}/provider-complete`,
  
  BOOKINGS: "/api/bookings",
  CANCEL_BOOKING: (bookingId: string) => `/api/bookings/${bookingId}/cancel`,
  GET_PAYOUTS: "/api/payouts",
  GET_DASHBOARD_STATS: "/api/dashboards/provider/stats",
  PAYOUT_REQUESTS: "/api/payouts/requests",
} as const;

export const AdminRoutes = {
  GET_PROVIDER_PROFILES: "/api/providers",
  GET_PROVIDER_PROFILE_BY_ID: "/api/providers/:id",
  APPROVE_PROVIDER: "/api/providers/:id/approve",
  APPROVE_REJECT: "/api/providers/:id/reject",
  BLOCK_PROVIDER: "/api/providers/:id/block",
  
  GET_PROVIDER_BANK: (providerId: string) => `/api/providers/${providerId}/bank`,
  APPROVE_PROVIDER_BANK: (providerId: string) => `/api/providers/${providerId}/bank/approve`,
  
  GET_CLIENT_PROFILES: "/api/clients",
  GET_CLIENT_PROFILE_BY_ID: "/api/clients/:id",
  BLOCK_CLIENT: "/api/clients/:id/block",
  
  GET_KYC_DOCUMENT: "/api/providers/:userId/kyc",
  
  CREATE_CATEGORY: "/api/categories",
  GET_ALL_CATEGORIES: "/api/categories/all",
  GET_ALL_PAGINATED_CATEGORIES: "/api/categories",
  UPDATE_CATEGORY: "/api/categories/:categoryId", 
  
  CREATE_SERVICE: "/api/services",
  DELETE_SERVICE: "/api/services/:serviceId",
  GET_ALL_SERVICES: "/api/services/all",
  GET_ALL_PAGINATED_SERVICES: "/api/services",
  TOGGLE_SERVICE: "/api/services/:serviceId/toggle",
  UPDATE_SERVICE: "/api/services/:serviceId",
  
  GET_DASHBOARD_STATS: "/api/dashboards/admin/stats",
  GET_PAYMENTS: "/api/payments",
  PAYOUT_REQUESTS: "/api/payouts/admin/requests",
} as const;

export const PublicRoutes = {
  GET_SERVICES: "/api/public/services",
  GET_CATEGORIES: "/api/public/categories",
  GET_SERVICES_BY_CATEGORY: "/api/public/services/:categoryId",
  GET_PROVIDERS_BY_CATEGORY: "api/public/providers",
  GET_PROVIDER_PORTFOLIO: "/api/public/providers/:providerId/portfolio",
  GET_PROVIDER_AVAILABILITY: "/api/public/providers/:providerId/availability",
  GET_PROVIDER_AVAILABILITY_OVERRIDES:
    "/api/public/providers/:providerId/availability/overrides",
  GET_PROVIDER_UNAVAILABILITY:
    "/api/public/providers/:providerId/unavailability",
  GET_PROVIDER_PROFILE: "/api/public/providers/:providerId/profile",
  GET_PROVIDER_ACTIVE_SERVICES: "/api/public/providers/:providerId/services",
} as const;

export const LocationRoutes = {
  GET_LOCATION: '/api/location/search',
  GET_LOCATION_DETAILS: '/api/location/details'
} as const;

export const SubscriptionRoutes = {
  ADMIN_PLANS: "/api/subscriptions/admin/plans",
  ADMIN_PLAN_BY_ID: "/api/subscriptions/admin/plans/:id",
  PROVIDER_ACTIVE_PLANS: "/api/subscriptions/provider/active-plans",
  PROVIDER_CHECKOUT: "/api/subscriptions/provider/checkout",
  PROVIDER_STATUS: "/api/subscriptions/provider/my-status",
  PROVIDER_UPGRADE_CHECKOUT: "/api/subscriptions/provider/upgrade-checkout",
} as const;

export const ChatRoutes = {
  GET_CONVERSATION: "/api/chat/conversations",
  GET_MESSAGES: "/api/chat/messages/:conversationId",
  FIND_OR_CREATE_CONVERSATION: "/api/chat/conversations",
  RESET_UNREAD_COUNT: "/api/chat/conversations/:conversationId/reset",
  GET_UPLOAD_URL: "/api/chat/presigned-url"
} as const;

export const NotificationRoutes = {
  GET_NOTIFICATIONS: "/api/notifications",
  UNREAD_COUNT: "/api/notifications/unread-count",
  MARK_READ: "/api/notifications/:id/read",
  MARK_ALL_READ: "/api/notifications/read-all",
  DELETE_NOTIFICATION: "/api/notifications/:id",
} as const;

export const ReviewRoutes = {
  CREATE: "/api/reviews",
  GET_PROVIDER_REVIEWS: "/api/reviews/provider/:providerId",
  GET_CLIENT_REVIEWS: "/api/reviews/client",
  GET_PENDING: "/api/reviews/pending",
  COMPLETE_BOOKING: "/api/bookings/:id/complete", 
} as const;