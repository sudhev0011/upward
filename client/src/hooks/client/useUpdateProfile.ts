import { clientApi } from "@/api/client.api"
import { useMutation } from "@tanstack/react-query"

export const useUpdateProfileMutation = ()=>{
    return useMutation({
        mutationFn: clientApi.updateProfile
    })
}