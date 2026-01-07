import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { BlogTag } from "@/types/blog";
import { tagSchema } from "./create-blog-tag";

export type UpdateBlogTagInput = z.infer<typeof tagSchema>;

export const updateBlogTag = ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlogTagInput;
}): Promise<BlogTag> => {
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
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      queryClient.invalidateQueries({
        queryKey: ["blog-tag", data.id],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
