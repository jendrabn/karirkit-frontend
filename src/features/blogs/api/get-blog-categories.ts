import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type BlogCategoriesResponse = {
  items: BlogCategory[];
};

export const getBlogCategories = (): Promise<BlogCategoriesResponse> => {
  return api.get("/blogs/categories");
};

export const getBlogCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["blog-categories"],
    queryFn: () => getBlogCategories(),
  });
};

type UseBlogCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getBlogCategoriesQueryOptions>;
};

export const useBlogCategories = ({
  queryConfig,
}: UseBlogCategoriesOptions = {}) => {
  return useQuery({
    ...getBlogCategoriesQueryOptions(),
    ...queryConfig,
  });
};
