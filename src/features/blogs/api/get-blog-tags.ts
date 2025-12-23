import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type BlogTagsResponse = {
  items: BlogTag[];
};

export const getBlogTags = (): Promise<BlogTagsResponse> => {
  return api.get("/blogs/tags");
};

export const getBlogTagsQueryOptions = () => {
  return queryOptions({
    queryKey: ["blog-tags"],
    queryFn: () => getBlogTags(),
  });
};

type UseBlogTagsOptions = {
  queryConfig?: QueryConfig<typeof getBlogTagsQueryOptions>;
};

export const useBlogTags = ({ queryConfig }: UseBlogTagsOptions = {}) => {
  return useQuery({
    ...getBlogTagsQueryOptions(),
    ...queryConfig,
  });
};
