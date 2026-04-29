import { adminApi } from "@/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export const useGetAllServicesQuery = ()=>{
    return useQuery({
        queryKey: ['servicesAdmin',"all"],
        queryFn: adminApi.getAllServices
    })
}