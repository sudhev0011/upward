import { adminApi } from "@/api/admin.api"
import { RequestParams } from "@/interfaces/auth"
import { useQuery } from "@tanstack/react-query"

export const useGetClientsProfile = (params: RequestParams)=>{
    return useQuery({
    queryKey: ["clients", params],
    queryFn: () => adminApi.getAllClients(params), 
  })
}