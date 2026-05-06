import { adminApi } from "@/api/admin.api"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/main"

export const useCreateServiceMutation = ()=>{
    return useMutation({
        mutationFn: adminApi.createService,
        onSuccess: ()=> queryClient.invalidateQueries({ 
        queryKey: ["servicesAdmin", "list"] 
      })
    })
}