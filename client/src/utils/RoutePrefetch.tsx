import { UserRole } from "@/constants/user-role";

export const prefetchRouteForRole = (role?: UserRole | null) => {
  switch (role) {
    case UserRole.CLIENT:
      import("@/routes/ClientRoutes");
      break;
    case UserRole.PROVIDER:
      import("@/routes/ProviderRoutes");
      break;
    case UserRole.ADMIN:
      import("@/routes/AdminRoutes");
      break;
    default:
      break;
  }
};

export const prefetchPublicRoutes = () => {
  import("@/routes/PublicRoutes");
};