import { authApi } from "@/api/auth.api";
import type { ApiEnvelope, ApiErrorResponse, AuthResponseData, LoginPayload } from "@/interfaces/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


export const useLoginMutation = ()=>{
    return useMutation<ApiEnvelope<AuthResponseData>, ApiErrorResponse, LoginPayload>({
        mutationFn: authApi.login
    })
}