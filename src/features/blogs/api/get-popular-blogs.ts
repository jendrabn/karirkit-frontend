import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Blog } from "./get-blogs";

export type GetPopularBlogsParams = {
  limit?: number;
  window?: "1d" | "7d" | "30d";
};

export const getPopularBlogs = (
  params?: GetPopularBlogsParams
): Promise<Blog[]> => {
  return api.get("/blogs/popular", {
    params,
  });
};

export const getPopularBlogsQueryOptions = (params?: GetPopularBlogsParams) => {
  return queryOptions({
    queryKey: ["blogs-popular", params],
    queryFn: () => getPopularBlogs(params),
  });
};

type UsePopularBlogsOptions = {
  params?: GetPopularBlogsParams;
  queryConfig?: QueryConfig<typeof getPopularBlogsQueryOptions>;
};

export const usePopularBlogs = ({
  params,
  queryConfig,
}: UsePopularBlogsOptions = {}) => {
  return useQuery({
    ...getPopularBlogsQueryOptions(params),
    ...queryConfig,
  });
};
