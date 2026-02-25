import { authApi } from "@/api/auth.api"
import type { ApiEnvelope, AuthResponseData, VerifyOtpPayload } from "@/interfaces/auth"
import { useMutation } from "@tanstack/react-query"

export const useVerifyOtpMutation = ()=>{
    return useMutation<ApiEnvelope<AuthResponseData>, Error, VerifyOtpPayload>({
        mutationFn: authApi.verifyOtp
    })
}