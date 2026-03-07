import { authApi } from "@/api/auth.api"
import { useQuery } from "@tanstack/react-query"

export const useCheckAuthQuery = ()=>{
    return useQuery({
        queryKey: ['authData'],
        queryFn: authApi.checkAuth,
        retry: false,
    })
}