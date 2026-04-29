import { publicApi } from "@/api/public.api"
import { useQuery } from "@tanstack/react-query"

export const useGetAllServicesByCategory = (categoryId: string)=>{
    return useQuery({
        queryKey: ['services', categoryId],
        queryFn: ()=> publicApi.getServicesByCategory(categoryId)
    })
}