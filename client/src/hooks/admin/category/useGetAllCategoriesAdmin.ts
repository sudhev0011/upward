import { adminApi } from "@/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export const useGetAllCategoriesAdmin = ()=>{
    return useQuery({
        queryKey: ['categoriesAdmin',"all"],
        queryFn: adminApi.getAllCategories
    })
}