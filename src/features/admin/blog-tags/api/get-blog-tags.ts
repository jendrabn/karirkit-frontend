import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { BlogTag } from "@/types/blog";
export type { BlogTag };
import type { ListResponse } from "@/types/api";

export type GetBlogTagsParams = {
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

export const getBlogTags = (
  params?: GetBlogTagsParams
): Promise<ListResponse<BlogTag>> => {
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
