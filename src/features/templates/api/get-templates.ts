import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type Template = {
  id: string;
  name: string;
  slug: string;
  type: "cv" | "application_letter";
  language: "en" | "id";
  preview: string;
  previewImage: string; // Mapped from preview for compatibility
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

type ApiTemplate = {
  id: string;
  name: string;
  slug: string;
  type: "cv" | "application_letter";
  language: "en" | "id";
  preview: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type TemplatesResponse = {
  items: Template[];
};

type ApiTemplatesResponse = {
  items: ApiTemplate[];
};

export type GetTemplatesParams = {
  type?: "cv" | "application_letter";
  language?: "en" | "id";
};

export const getTemplates = async (
  params?: GetTemplatesParams
): Promise<TemplatesResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined
        )
      )
    : undefined;

  const response = await api.get("/templates", {
    params: filteredParams,
  }) as ApiTemplatesResponse;

  // API client already unwraps to response.items, so we map directly
  return {
    items: (response.items || []).map((item: ApiTemplate) => ({
      ...item,
      previewImage: item.preview, // Map preview to previewImage
    })),
  };
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
