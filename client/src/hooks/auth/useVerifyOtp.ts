import { authApi } from "@/api/auth.api"
import type { ApiEnvelope, ApiErrorResponse, AuthResponseData, VerifyOtpPayload } from "@/interfaces/auth"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

export const useVerifyOtpMutation = ()=>{
    return useMutation<ApiEnvelope<AuthResponseData>, AxiosError<ApiErrorResponse>, VerifyOtpPayload>({
        mutationFn: authApi.verifyOtp
    })
}