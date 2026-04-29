import { publicApi } from "@/api/public.api"
import { useQuery } from "@tanstack/react-query"

export const useGetAllProviderServiceQuery = ()=>{
    return useQuery({
        queryKey: ['services'],
        queryFn: publicApi.getAllServices
    })
}