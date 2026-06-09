import { providerApi } from "@/api/provider.api"
import { useMutation } from "@tanstack/react-query"

export const useConfigureProviderServiceMutation = ()=>{
    return useMutation({
        mutationFn: providerApi.setProviderServicePrice
    })
}