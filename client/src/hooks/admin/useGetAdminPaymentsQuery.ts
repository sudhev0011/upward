import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useGetAdminPaymentsQuery = (params: {
  page?: number;
  limit?: number;
  search?: string;
  transactionStatus?: string;
}) => {
  return useQuery({
    queryKey: ["adminPayments", params],
    queryFn: () => adminApi.getPayments(params),
  });
};
