import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { BlogCategory } from "./get-blog-categories";

export type BlogCategoryResponse = BlogCategory;

export const getBlogCategory = (id: string): Promise<BlogCategoryResponse> => {
  return api.get(`/admin/blog-categories/${id}`);
};

export const getBlogCategoryQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["blog-category", id],
    queryFn: () => getBlogCategory(id),
  });
};

type UseBlogCategoryOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getBlogCategoryQueryOptions>;
};

export const useBlogCategory = ({
  id,
  queryConfig,
}: UseBlogCategoryOptions) => {
  return useQuery({
    ...getBlogCategoryQueryOptions(id),
    ...queryConfig,
  });
};
