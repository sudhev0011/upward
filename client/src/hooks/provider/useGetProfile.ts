import { providerApi } from "@/api/provider.api";
import { useQuery } from "@tanstack/react-query";

export const useGetProfileQuery = () => {
    return useQuery({
        queryKey: ['providerProfile'],
        queryFn: providerApi.getProviderProfile
    });
};
