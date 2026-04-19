import { adminApi } from "@/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export const useGetProviderProfiles = (params: any)=>{
    return useQuery({
        queryKey: ['providerProfiles', params],
        queryFn: ()=> adminApi.getAllProviders(params)
    })
}