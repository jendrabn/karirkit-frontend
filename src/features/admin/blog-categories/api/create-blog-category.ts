import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogCategory } from "@/types/blog";

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type CreateBlogCategoryInput = CategoryFormData;

export const createBlogCategory = (
  data: CreateBlogCategoryInput
): Promise<BlogCategory> => {
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
