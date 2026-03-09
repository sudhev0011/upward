import { authApi } from "@/api/auth.api"
import { useMutation } from "@tanstack/react-query"

export const useResetPasswordMutation = ()=>{
    return useMutation({
        mutationFn: authApi.resetPassword
    })
}