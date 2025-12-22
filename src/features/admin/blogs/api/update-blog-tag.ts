import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { setFormErrors } from "@/hooks/use-form-errors";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogTag } from "./get-blog-tags";

export type UpdateBlogTagInput = {
  name: string;
  slug: string;
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

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateBlogTag,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      queryClient.invalidateQueries({ queryKey: ["blog-tag", args[1].id] });
      onSuccess?.(...args);
    },
    onError: (error, ...args) => {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      onError?.(error, ...args);
    },
    ...restConfig,
  });
};
