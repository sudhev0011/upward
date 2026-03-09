import { authApi } from "@/api/auth.api"
import { useMutation } from "@tanstack/react-query"

export const useLogoutMutation = ()=>{
    return useMutation({
        mutationFn: authApi.logout
    })
}