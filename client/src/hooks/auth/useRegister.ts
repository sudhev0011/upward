import { authApi } from "@/api/auth.api";
import type { AuthResponseData, ApiEnvelope, RegisterPayload } from "@/interfaces/auth";
import { useMutation } from "@tanstack/react-query";


export const useRegisterMutation = ()=>{
    return useMutation<ApiEnvelope<AuthResponseData>, Error, RegisterPayload>({
        mutationFn: authApi.register
    })
}