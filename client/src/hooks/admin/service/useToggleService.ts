import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import {
  PaginatedServicesResponse,
  ServiceResponse,
} from "@/interfaces/admin/service.interface";

export const useToggleService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.toggleService,

    onSuccess: (response) => {
      if (!response.data) return;
      const updatedService = response.data;

      queryClient.setQueriesData(
        { queryKey: ["servicesAdmin", "list"] },
        (oldData: { data: PaginatedServicesResponse }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((service: ServiceResponse) =>
                service.id === updatedService.id
                  ? { ...service, isActive: updatedService.isActive }
                  : service,
              ),
            },
          };
        },
      );
    },
  });
};
