import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Blog } from "./get-blogs";

export type RelatedBlogsResponse = Blog[];

export type GetRelatedBlogsParams = {
  slug: string;
  limit?: number;
};

export const getRelatedBlogs = ({
  slug,
  limit = 4,
}: GetRelatedBlogsParams): Promise<RelatedBlogsResponse> => {
  return api.get(`/blogs/${slug}/related`, {
    params: {
      limit,
    },
  });
};

export const getRelatedBlogsQueryOptions = ({
  slug,
  limit,
}: GetRelatedBlogsParams) => {
  return queryOptions({
    queryKey: ["related-blogs", slug, limit],
    queryFn: () => getRelatedBlogs({ slug, limit }),
  });
};

type UseRelatedBlogsOptions = {
  params: GetRelatedBlogsParams;
  queryConfig?: QueryConfig<typeof getRelatedBlogsQueryOptions>;
};

export const useRelatedBlogs = ({
  params,
  queryConfig,
}: UseRelatedBlogsOptions) => {
  return useQuery({
    ...getRelatedBlogsQueryOptions(params),
    ...queryConfig,
  });
};
