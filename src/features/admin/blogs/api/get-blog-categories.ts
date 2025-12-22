import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type BlogCategoriesResponse = {
  items: BlogCategory[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};

export type GetBlogCategoriesParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name";
};

export const getBlogCategories = (
  params?: GetBlogCategoriesParams
): Promise<BlogCategoriesResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/admin/blog-categories", {
    params: filteredParams,
  });
};

export const getBlogCategoriesQueryOptions = (
  params?: GetBlogCategoriesParams
) => {
  return queryOptions({
    queryKey: ["blog-categories", params],
    queryFn: () => getBlogCategories(params),
  });
};

type UseBlogCategoriesOptions = {
  params?: GetBlogCategoriesParams;
  queryConfig?: QueryConfig<typeof getBlogCategoriesQueryOptions>;
};

export const useBlogCategories = ({
  params,
  queryConfig,
}: UseBlogCategoriesOptions = {}) => {
  return useQuery({
    ...getBlogCategoriesQueryOptions(params),
    ...queryConfig,
  });
};
