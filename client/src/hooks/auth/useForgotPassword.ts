import { authApi } from "@/api/auth.api"
import { useMutation } from "@tanstack/react-query"

export const useForgotPasswordMutation = ()=>{
    return useMutation({
        mutationFn: authApi.forgotPassword
    })
}