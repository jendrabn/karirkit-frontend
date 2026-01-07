import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogCategory } from "@/types/blog";
import { categorySchema } from "./create-blog-category";

export type UpdateBlogCategoryInput = z.infer<typeof categorySchema>;

export const updateBlogCategory = ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlogCategoryInput;
}): Promise<BlogCategory> => {
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
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["blog-category", data.id],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
