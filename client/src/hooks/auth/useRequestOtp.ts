import { authApi } from "@/api/auth.api"
import { ApiEnvelope } from "@/interfaces/auth"
import { useMutation } from "@tanstack/react-query"
import { ApiErrorResponse } from "@/interfaces/auth"
import { AxiosError } from "axios"

export const useRequestOtpMutation = ()=>{
    return useMutation<ApiEnvelope<void>, AxiosError<ApiErrorResponse>, string>({
        mutationFn: authApi.requestOtp
    })
}