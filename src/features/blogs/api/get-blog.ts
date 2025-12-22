import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Blog } from "./get-blogs";

export type BlogResponse = Blog;

export const getBlog = (slug: string): Promise<BlogResponse> => {
  return api.get(`/blogs/${slug}`);
};

export const getBlogQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ["blog", slug],
    queryFn: () => getBlog(slug),
  });
};

type UseBlogOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getBlogQueryOptions>;
};

export const useBlog = ({ slug, queryConfig }: UseBlogOptions) => {
  return useQuery({
    ...getBlogQueryOptions(slug),
    ...queryConfig,
  });
};
