import { publicApi } from "@/api/public.api"
import { useQuery } from "@tanstack/react-query"

export const useGetAllCategories = ()=>{
    return useQuery({
        queryKey: ['categories'],
        queryFn: publicApi.getAllCategories
    })
}