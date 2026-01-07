import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Blog } from "@/types/blog";

export const getBlog = (id: string): Promise<Blog> => {
  return api.get(`/admin/blogs/${id}`);
};

export const getBlogQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["admin-blog", id],
    queryFn: () => getBlog(id),
  });
};

type UseBlogOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getBlogQueryOptions>;
};

export const useBlog = ({ id, queryConfig }: UseBlogOptions) => {
  return useQuery({
    ...getBlogQueryOptions(id),
    ...queryConfig,
  });
};
