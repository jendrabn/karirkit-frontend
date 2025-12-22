import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { setFormErrors } from "@/hooks/use-form-errors";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogCategory } from "./get-blog-categories";

export type CreateBlogCategoryInput = {
  name: string;
  slug: string;
  description: string;
};

export type CreateBlogCategoryResponse = BlogCategory;

export const createBlogCategory = (
  data: CreateBlogCategoryInput
): Promise<CreateBlogCategoryResponse> => {
  return api.post("/admin/blog-categories", data);
};

type UseCreateBlogCategoryOptions = {
  mutationConfig?: MutationConfig<typeof createBlogCategory>;
};

export const useCreateBlogCategory = ({
  mutationConfig,
}: UseCreateBlogCategoryOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createBlogCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
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
