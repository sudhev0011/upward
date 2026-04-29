import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdateProviderProfileRequest } from "@/interfaces/provider/provider.interface";

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProviderProfileRequest) => providerApi.updateProviderProfile(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || "Profile updated successfully");
                queryClient.invalidateQueries({ queryKey: ['providerProfile'] });
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        },
        onError: (error) => {
            const message = error.message || "Failed to update profile. Please try again.";
            toast.error(message);
        }
    });
};
