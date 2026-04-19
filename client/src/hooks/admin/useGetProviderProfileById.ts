import { adminApi } from "@/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export const useGetProviderProfileById = (userId:string | null)=>{
    return useQuery({
        queryKey: ['providerProfile',userId],
        queryFn: ()=> {
            if (!userId) {
                throw new Error("userId is required");
            }
            return adminApi.getProviderDetails(userId);
        },
        enabled: !!userId
    })
}