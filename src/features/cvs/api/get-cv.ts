import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { CV } from "./get-cvs";

export type CVResponse = CV;

export const getCV = (id: string): Promise<CVResponse> => {
  return api.get(`/cvs/${id}`);
};

export const getCVQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["cv", id],
    queryFn: () => getCV(id),
  });
};

type UseCVOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getCVQueryOptions>;
};

export const useCV = ({ id, queryConfig }: UseCVOptions) => {
  return useQuery({
    ...getCVQueryOptions(id),
    ...queryConfig,
  });
};
