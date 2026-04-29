import { adminApi } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query"

export const useGetAllPaginatedServices = (params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  mode?: "onsite" | "offsite" | "both";
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
})=>{
    return useQuery({
        queryKey: ["servicesAdmin", "list", params],
        queryFn: ()=>adminApi.getAllPaginatedServices(params)
    })
}