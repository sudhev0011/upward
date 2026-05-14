import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryResponse, PaginatedCategoryResponse } from "@/interfaces/admin/category.interface";
import { adminApi } from "@/api/admin.api";

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateCategory,

    onSuccess: (res) => {
      if(!res.data) return 

      const updated: CategoryResponse = res.data;

      queryClient.setQueriesData(
        { queryKey: ["categoriesAdmin","list"] },
        (oldData: {data:PaginatedCategoryResponse}) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((cat: CategoryResponse) =>
                cat.id === updated.id ? updated : cat
              ),
            },
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
    },
  });
};