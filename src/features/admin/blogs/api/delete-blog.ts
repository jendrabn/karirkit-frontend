import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const deleteBlog = (id: string): Promise<MessageResponse> => {
  return api.delete(`/admin/blogs/${id}`);
};

type UseDeleteBlogOptions = {
  mutationConfig?: MutationConfig<typeof deleteBlog>;
};

export const useDeleteBlog = ({
  mutationConfig,
}: UseDeleteBlogOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
