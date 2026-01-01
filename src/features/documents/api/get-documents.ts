import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
  Document,
  DocumentPagination,
  DocumentType,
} from "@/types/document";

export type DocumentsResponse = {
  items: Document[];
  pagination: DocumentPagination;
};

export type GetDocumentsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  type?: DocumentType;
  sort_by?: "uploaded_at" | "original_name" | "size" | "type";
  sort_order?: "asc" | "desc";
};

export const getDocuments = (
  params?: GetDocumentsParams
): Promise<DocumentsResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/documents", {
    params: filteredParams,
  });
};

export const getDocumentsQueryOptions = (params?: GetDocumentsParams) => {
  return queryOptions({
    queryKey: ["documents", params],
    queryFn: () => getDocuments(params),
  });
};

type UseDocumentsOptions = {
  params?: GetDocumentsParams;
  queryConfig?: QueryConfig<typeof getDocumentsQueryOptions>;
};

export const useDocuments = ({
  params,
  queryConfig,
}: UseDocumentsOptions = {}) => {
  return useQuery({
    ...getDocumentsQueryOptions(params),
    ...queryConfig,
  });
};
