import { adminApi } from "@/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export const useGetClientProfileById = (userId: string | null)=>{
    return useQuery({
    queryKey: ["client-detail", userId],
    queryFn: () => adminApi.getClientDetails(userId!),
    enabled: !!userId,
  })
}