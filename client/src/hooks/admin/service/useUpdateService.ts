import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import {
  PaginatedServicesResponse,
  ServiceResponse,
} from "@/interfaces/admin/service.interface";
import { toast } from "sonner";

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateService,

    onSuccess: (response) => {
      if (!response.data) return;
      const updatedService = response.data;

      queryClient.setQueriesData(
        { queryKey: ["servicesAdmin", "list"] },
        (oldData: { data: PaginatedServicesResponse }) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((service: ServiceResponse) =>
                service.id === updatedService.id
                  ? { ...service, ...updatedService }
                  : service
              ),
            },
          };
        }
      );
      
      queryClient.invalidateQueries({ queryKey: ["servicesAdmin", "list"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Update failed");
    },
  });
};