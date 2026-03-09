import { authApi } from "@/api/auth.api"
import { useMutation } from "@tanstack/react-query"

export const useRequestOtpMutation = ()=>{
    return useMutation({
        mutationFn: authApi.requestOtp
    })
}