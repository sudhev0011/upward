import { authApi } from "@/api/auth.api"
import { ApiEnvelope, ApiErrorResponse, ResetPasswordPayload } from "@/interfaces/auth"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useResetPasswordMutation = ()=>{
    return useMutation<ApiEnvelope<void>, AxiosError<ApiErrorResponse>, ResetPasswordPayload>({
        mutationFn: authApi.resetPassword
    })
}