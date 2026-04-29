import { providerApi } from "@/api/provider.api"
import { useQuery } from "@tanstack/react-query"

export const useGetProviderSericeByCategoryQuery = (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    mode?: "onsite" | "offsite" | "both";
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  } )=>{
    return useQuery({
        queryKey: ['providerServices','list',params],
        queryFn:()=> providerApi.getProviderServiceGroupedByCategory(params)
    })
}