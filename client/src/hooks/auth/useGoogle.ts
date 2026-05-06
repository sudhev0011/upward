import { authApi } from "@/api/auth.api";
import type { ApiEnvelope, ApiErrorResponse, AuthResponseData, GoogleLoginPayload } from "@/interfaces/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGoogleLoginMutation = () => {
	return useMutation<ApiEnvelope<AuthResponseData>, AxiosError<ApiErrorResponse>, GoogleLoginPayload>({
        mutationFn: authApi.googleLogin
    })
};