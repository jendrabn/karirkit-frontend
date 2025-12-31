import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogTag } from "./get-blog-tags";

export type UpdateBlogTagInput = {
  name: string;
};

export type UpdateBlogTagResponse = BlogTag;

export const updateBlogTag = ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlogTagInput;
}): Promise<UpdateBlogTagResponse> => {
  return api.put(`/admin/blog-tags/${id}`, data);
};

type UseUpdateBlogTagOptions = {
  mutationConfig?: MutationConfig<typeof updateBlogTag>;
};

export const useUpdateBlogTag = ({
  mutationConfig,
}: UseUpdateBlogTagOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateBlogTag,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      queryClient.invalidateQueries({
        queryKey: ["blog-tag", args[1].id],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
