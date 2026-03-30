import { providerApi } from "@/api/provider.api"
import { useQuery } from "@tanstack/react-query"

export const useGetBankDocument = ()=>{
    return useQuery({
        queryKey: ['bankData'],
        queryFn: providerApi.getBankDocument
    })
};