import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Blog } from "@/types/blog";
import { type CreateBlogInput } from "./create-blog";

export type UpdateBlogInput = CreateBlogInput;

export const updateBlog = ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlogInput;
}): Promise<Blog> => {
  return api.put(`/admin/blogs/${id}`, data);
};

type UseUpdateBlogOptions = {
  mutationConfig?: MutationConfig<typeof updateBlog>;
};

export const useUpdateBlog = ({
  mutationConfig,
}: UseUpdateBlogOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateBlog,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
