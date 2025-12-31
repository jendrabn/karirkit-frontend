import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogCategory } from "./get-blog-categories";

export type CreateBlogCategoryInput = {
  name: string;
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

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createBlogCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
