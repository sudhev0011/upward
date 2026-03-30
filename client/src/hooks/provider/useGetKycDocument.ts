import { providerApi } from "@/api/provider.api"
import { useQuery } from "@tanstack/react-query"

export const useGetKycDocument = ()=>{
    return useQuery({
        queryKey: ['kycData'],
        queryFn: providerApi.getKycDocument
    })
}