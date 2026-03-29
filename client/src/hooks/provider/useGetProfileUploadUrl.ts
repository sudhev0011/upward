import { providerApi } from "@/api/provider.api"
import { useMutation } from "@tanstack/react-query"

export const useGetProfileUploadUrl = ()=>{
    return useMutation({
        mutationFn: providerApi.getUploadProfileUrl
    })
}
