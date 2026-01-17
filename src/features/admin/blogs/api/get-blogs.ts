import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { BlogListResponse } from "@/types/blog";

export type GetBlogsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "published_at"
    | "title"
    | "views"
    | "read_time";
  status?: "draft" | "published" | "archived";
  category_id?: string;
  user_id?: string;
  tag_id?: string;
  published_at_from?: string;
  published_at_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  read_time_from?: number;
  read_time_to?: number;
  views_from?: number;
  views_to?: number;
};

export const getBlogs = (
  params?: GetBlogsParams
): Promise<BlogListResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/admin/blogs", {
    params: filteredParams,
  });
};

export const getBlogsQueryOptions = (params?: GetBlogsParams) => {
  return queryOptions({
    queryKey: ["admin-blogs", params],
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
