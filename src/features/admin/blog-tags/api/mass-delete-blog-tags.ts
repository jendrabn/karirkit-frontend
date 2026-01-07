import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const massDeleteBlogTags = ({
  ids,
}: {
  ids: string[];
}): Promise<MessageResponse> => {
  return api.delete(`/admin/blog-tags/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteBlogTagsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteBlogTags>;
};

export const useMassDeleteBlogTags = ({
  mutationConfig,
}: UseMassDeleteBlogTagsOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["blog-tags"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteBlogTags,
  });
};
