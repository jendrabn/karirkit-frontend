import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogCategory } from "./get-blog-categories";

export type UpdateBlogCategoryInput = {
  name: string;
  slug: string;
  description: string;
};

export type UpdateBlogCategoryResponse = BlogCategory;

export const updateBlogCategory = ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlogCategoryInput;
}): Promise<UpdateBlogCategoryResponse> => {
  return api.put(`/admin/blog-categories/${id}`, data);
};

type UseUpdateBlogCategoryOptions = {
  mutationConfig?: MutationConfig<typeof updateBlogCategory>;
};

export const useUpdateBlogCategory = ({
  mutationConfig,
}: UseUpdateBlogCategoryOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateBlogCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["blog-category", args[1].id],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
