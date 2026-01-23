import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { BlogCategory } from "./get-blog-categories";
import type { BlogTag } from "./get-blog-tags";

export type BlogUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  avatar: string;
  created_at: string;
  updated_at: string;
};

export type Blog = {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: "draft" | "published" | "archived";
  read_time: number;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  user: BlogUser;
  category: BlogCategory;
  tags: BlogTag[];
};

export type BlogsResponse = {
  items: Blog[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};

export type GetBlogsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "published_at" | "title" | "views";
  status?: "published";
  category_id?: string;
  tag_id?: string;
  author_id?: string;
  published_from?: string;
  published_to?: string;
};

export const getBlogs = (params?: GetBlogsParams): Promise<BlogsResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/blogs", {
    params: filteredParams,
  });
};

export const getBlogsQueryOptions = (params?: GetBlogsParams) => {
  return queryOptions({
    queryKey: ["blogs", params],
    queryFn: () => getBlogs(params),
  });
};

type UseBlogsOptions = {
  params?: GetBlogsParams;
  queryConfig?: QueryConfig<typeof getBlogsQueryOptions>;
};

export const useBlogs = ({ params, queryConfig }: UseBlogsOptions = {}) => {
  return useQuery({
    ...getBlogsQueryOptions(params),
    ...queryConfig,
  });
};
