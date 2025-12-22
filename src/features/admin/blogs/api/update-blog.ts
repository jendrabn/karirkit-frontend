import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Blog } from "./get-blogs";

export type UpdateBlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: "draft" | "published" | "archived";
  read_time: number;
  category_id: string;
  author_id: string;
  tag_ids: string[];
};

export type UpdateBlogResponse = Blog;

export const updateBlog = ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlogInput;
}): Promise<UpdateBlogResponse> => {
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
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog", args[1].id] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
