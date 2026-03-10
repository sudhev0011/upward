import { clientApi } from "@/api/client.api"
import { useQuery } from "@tanstack/react-query"

export const useGetProfileQuery = ()=>{
    return useQuery({
        queryKey: ['clientProfile'],
        queryFn: clientApi.getProfile
    })
}