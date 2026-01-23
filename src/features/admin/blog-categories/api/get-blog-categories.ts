import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { BlogCategory } from "@/types/blog";
export type { BlogCategory };
import type { ListResponse } from "@/types/api";

export type GetBlogCategoriesParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name" | "blog_count";
  blog_count_from?: number;
  blog_count_to?: number;
  created_at_from?: string;
  created_at_to?: string;
};

export const getBlogCategories = (
  params?: GetBlogCategoriesParams
): Promise<ListResponse<BlogCategory>> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== null && value !== "" && value !== undefined
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
