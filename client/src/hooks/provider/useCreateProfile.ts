import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateProviderProfileRequest } from "@/interfaces/provider/provider.interface";

export const useCreateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProviderProfileRequest) => providerApi.createProviderProfile(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || "Profile created successfully");
                queryClient.invalidateQueries({ queryKey: ['providerProfile'] });
            } else {
                toast.error(response.message || "Failed to create profile");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to create profile. Please try again.";
            toast.error(message);
        }
    });
};
