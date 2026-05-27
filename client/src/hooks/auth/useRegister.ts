import { authApi } from "@/api/auth.api";
import type { AuthResponseData, ApiEnvelope, RegisterPayload, ApiErrorResponse } from "@/interfaces/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


export const useRegisterMutation = ()=>{
    return useMutation<ApiEnvelope<AuthResponseData>, AxiosError<ApiErrorResponse>, RegisterPayload>({
        mutationFn: authApi.register
    })
}