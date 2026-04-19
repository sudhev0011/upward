import { adminApi } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

export const useGetProviderKyc = (userId: string | null) => {
  return useQuery({
    queryKey: ["provider-kyc", userId],
    queryFn: async () => {
      if (!userId) throw new Error("userId is required");
      return adminApi.getKycDocument(userId);
    },
    enabled: !!userId,
  });
};