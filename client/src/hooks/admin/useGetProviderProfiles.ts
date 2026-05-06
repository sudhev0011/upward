import { adminApi } from "@/api/admin.api"
import { RequestParams } from "@/interfaces/auth"
import { useQuery } from "@tanstack/react-query"

export const useGetProviderProfiles = (params: RequestParams&{isApprovedByAdmin: boolean | undefined} )=>{
    return useQuery({
        queryKey: ['providerProfiles', params],
        queryFn: ()=> adminApi.getAllProviders(params)
    })
}