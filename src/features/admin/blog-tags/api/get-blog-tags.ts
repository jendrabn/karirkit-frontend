import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  blog_count: number;
  created_at: string;
  updated_at: string;
};

export type BlogTagsResponse = {
  items: BlogTag[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};

export type GetBlogTagsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name";
};

export const getBlogTags = (
  params?: GetBlogTagsParams
): Promise<BlogTagsResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/admin/blog-tags", {
    params: filteredParams,
  });
};

export const getBlogTagsQueryOptions = (params?: GetBlogTagsParams) => {
  return queryOptions({
    queryKey: ["blog-tags", params],
    queryFn: () => getBlogTags(params),
  });
};

type UseBlogTagsOptions = {
  params?: GetBlogTagsParams;
  queryConfig?: QueryConfig<typeof getBlogTagsQueryOptions>;
};

export const useBlogTags = ({
  params,
  queryConfig,
}: UseBlogTagsOptions = {}) => {
  return useQuery({
    ...getBlogTagsQueryOptions(params),
    ...queryConfig,
  });
};
