import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Blog } from "@/types/blog";

export const blogSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  featured_image: z.string().nullable().optional(),
  content: z.string().min(1, "Konten wajib diisi"),
  excerpt: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"], {
    message: "Status blog wajib dipilih",
  }),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  tag_ids: z.array(z.string()).optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
export type CreateBlogInput = BlogFormData & { author_id: string };

export const createBlog = (data: CreateBlogInput): Promise<Blog> => {
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
