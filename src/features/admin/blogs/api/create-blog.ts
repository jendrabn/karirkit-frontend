import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Blog } from "./get-blogs";

export type CreateBlogInput = {
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

export type CreateBlogResponse = Blog;

export const createBlog = (
  data: CreateBlogInput
): Promise<CreateBlogResponse> => {
  return api.post("/admin/blogs", data);
};

type UseCreateBlogOptions = {
  mutationConfig?: MutationConfig<typeof createBlog>;
};

export const useCreateBlog = ({
  mutationConfig,
}: UseCreateBlogOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createBlog,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
