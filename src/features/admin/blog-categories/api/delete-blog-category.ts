import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const deleteBlogCategory = (id: string): Promise<MessageResponse> => {
  return api.delete(`/admin/blog-categories/${id}`);
};

type UseDeleteBlogCategoryOptions = {
  mutationConfig?: MutationConfig<typeof deleteBlogCategory>;
};

export const useDeleteBlogCategory = ({
  mutationConfig,
}: UseDeleteBlogCategoryOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
