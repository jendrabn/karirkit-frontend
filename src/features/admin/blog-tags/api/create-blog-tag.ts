import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogTag } from "@/types/blog";

export const tagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi"),
});

export type TagFormData = z.infer<typeof tagSchema>;
export type CreateBlogTagInput = TagFormData;

export const createBlogTag = (data: CreateBlogTagInput): Promise<BlogTag> => {
  return api.post("/admin/blog-tags", data);
};

type UseCreateBlogTagOptions = {
  mutationConfig?: MutationConfig<typeof createBlogTag>;
};

export const useCreateBlogTag = ({
  mutationConfig,
}: UseCreateBlogTagOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createBlogTag,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
