import { adminApi } from "@/api/admin.api"
import { useMutation } from "@tanstack/react-query"

export const useCreateCategoryMutation = ()=>{
    return useMutation({
        mutationFn: adminApi.createCategory
    })
}