import { adminApi } from "@/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export const useGetClientsProfile = (params: any)=>{
    return useQuery({
    queryKey: ["clients", params],
    queryFn: () => adminApi.getAllClients(params), 
  })
}