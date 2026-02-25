import { authApi } from "@/api/auth.api";
import type { ApiEnvelope, AuthResponseData, LoginPayload } from "@/interfaces/auth";
import { useMutation } from "@tanstack/react-query";


export const useLoginMutation = ()=>{
    return useMutation<ApiEnvelope<AuthResponseData>, Error, LoginPayload>({
        mutationFn: authApi.login
    })
}