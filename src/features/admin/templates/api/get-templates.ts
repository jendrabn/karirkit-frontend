import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";

export interface Template {
  id: string;
  name: string;

  type: "cv" | "application_letter";
  language: "en" | "id";
  path: string;
  preview: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface TemplatesListResponse {
  items: Template[];
  pagination: Meta;
}

export interface GetTemplatesParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "name"
    | "type"
    | "language"
    | "is_premium";
  type?: "cv" | "application_letter";
  language?: "en" | "id";
  is_premium?: boolean;
}

export const getTemplates = (
  params?: GetTemplatesParams
): Promise<TemplatesListResponse> => {
  return api.get("/admin/templates", {
    params,
  });
};

export const getTemplatesQueryOptions = (params?: GetTemplatesParams) => {
  return queryOptions({
    queryKey: ["templates", params],
    queryFn: () => getTemplates(params),
  });
};

type UseTemplatesOptions = {
  params?: GetTemplatesParams;
  queryConfig?: QueryConfig<typeof getTemplatesQueryOptions>;
};

export const useTemplates = ({
  params,
  queryConfig,
}: UseTemplatesOptions = {}) => {
  return useQuery({
    ...getTemplatesQueryOptions(params),
    ...queryConfig,
  });
};
