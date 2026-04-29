import { adminApi } from "@/api/admin.api"
import { useMutation } from "@tanstack/react-query"

export const useDeleteServiceMutation = (id:string)=>{
    return useMutation({
        mutationFn: ()=> adminApi.deleteService(id)
    })
}