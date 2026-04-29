import { adminApi } from "@/api/admin.api"
import { useMutation } from "@tanstack/react-query"

export const useCreateServiceMutation = ()=>{
    return useMutation({
        mutationFn: adminApi.createService
    })
}