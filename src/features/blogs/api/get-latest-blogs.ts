import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Blog } from "./get-blogs";

export const getLatestBlogs = (limit: number = 4): Promise<Blog[]> => {
  return api.get("/blogs/latest", {
    params: { limit },
  });
};

export const getLatestBlogsQueryOptions = (limit?: number) => {
  return queryOptions({
    queryKey: ["blogs-latest", limit],
    queryFn: () => getLatestBlogs(limit),
  });
};

type UseLatestBlogsOptions = {
  limit?: number;
  queryConfig?: QueryConfig<typeof getLatestBlogsQueryOptions>;
};

export const useLatestBlogs = ({
  limit,
  queryConfig,
}: UseLatestBlogsOptions = {}) => {
  return useQuery({
    ...getLatestBlogsQueryOptions(limit),
    ...queryConfig,
  });
};
