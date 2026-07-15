import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useGetAdminProviderBank = (providerId: string | null) => {
  return useQuery({
    queryKey: ["adminProviderBank", providerId],
    queryFn: async () => {
      if (!providerId) return null;
      const response = await adminApi.getProviderBank(providerId);
      return response.data;
    },
    enabled: !!providerId,
  });
};
