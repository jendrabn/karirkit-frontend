import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { BlogTag } from "./get-blog-tags";

export type BlogTagResponse = BlogTag;

export const getBlogTag = (id: string): Promise<BlogTagResponse> => {
  return api.get(`/admin/blog-tags/${id}`);
};

export const getBlogTagQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["blog-tag", id],
    queryFn: () => getBlogTag(id),
  });
};

type UseBlogTagOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getBlogTagQueryOptions>;
};

export const useBlogTag = ({ id, queryConfig }: UseBlogTagOptions) => {
  return useQuery({
    ...getBlogTagQueryOptions(id),
    ...queryConfig,
  });
};
