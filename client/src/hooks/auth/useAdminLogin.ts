import { authApi } from "@/api/auth.api"
import { useMutation } from "@tanstack/react-query"

export const useAdminLoginMutation = ()=>{
    return useMutation({
        mutationFn: authApi.adminLogin
    });
}