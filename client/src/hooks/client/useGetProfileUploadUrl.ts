import { clientApi } from "@/api/client.api"
import { useMutation } from "@tanstack/react-query"

export const useGetProfileUploadUrl = ()=>{

    return useMutation({
        mutationFn: clientApi.getUploadProfileUrl
    })
}