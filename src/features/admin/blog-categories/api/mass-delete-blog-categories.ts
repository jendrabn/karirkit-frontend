import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const massDeleteBlogCategories = ({
  ids,
}: {
  ids: string[];
}): Promise<MessageResponse> => {
  return api.delete(`/admin/blog-categories/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteBlogCategoriesOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteBlogCategories>;
};

export const useMassDeleteBlogCategories = ({
  mutationConfig,
}: UseMassDeleteBlogCategoriesOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["blog-categories"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteBlogCategories,
  });
};
