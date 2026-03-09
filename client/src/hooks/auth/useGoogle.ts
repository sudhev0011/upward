import { authApi } from "@/api/auth.api";
import type { ApiEnvelope, AuthResponseData, GoogleLoginPayload } from "@/interfaces/auth";
import { useMutation } from "@tanstack/react-query";

export const useGoogleLoginMutation = () => {
	return useMutation<ApiEnvelope<AuthResponseData>, Error, GoogleLoginPayload>({
        mutationFn: authApi.googleLogin
    })
};