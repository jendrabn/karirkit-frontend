import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const deleteBlogTag = (id: string): Promise<void> => {
  return api.delete(`/admin/blog-tags/${id}`);
};

type UseDeleteBlogTagOptions = {
  mutationConfig?: MutationConfig<typeof deleteBlogTag>;
};

export const useDeleteBlogTag = ({
  mutationConfig,
}: UseDeleteBlogTagOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteBlogTag,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
