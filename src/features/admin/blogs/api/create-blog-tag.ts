import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { setFormErrors } from "@/hooks/use-form-errors";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogTag } from "./get-blog-tags";

export type CreateBlogTagInput = {
  name: string;
  slug: string;
};

export type CreateBlogTagResponse = BlogTag;

export const createBlogTag = (
  data: CreateBlogTagInput
): Promise<CreateBlogTagResponse> => {
  return api.post("/admin/blog-tags", data);
};

type UseCreateBlogTagOptions = {
  mutationConfig?: MutationConfig<typeof createBlogTag>;
};

export const useCreateBlogTag = ({
  mutationConfig,
}: UseCreateBlogTagOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createBlogTag,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
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
