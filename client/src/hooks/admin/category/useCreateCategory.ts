import { adminApi } from "@/api/admin.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateCategoryMutation = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminApi.createCategory,
        onSuccess: ()=>{
            queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] })
        }
    })
}