import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { CoverLetter } from "./get-cover-letters";

export type CoverLetterResponse = CoverLetter;

export const getCoverLetter = (id: string): Promise<CoverLetterResponse> => {
  return api.get(`/cover-letters/${id}`);
};

export const getCoverLetterQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["cover-letter", id],
    queryFn: () => getCoverLetter(id),
  });
};

type UseCoverLetterOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getCoverLetterQueryOptions>;
};

export const useCoverLetter = ({
  id,
  queryConfig,
}: UseCoverLetterOptions) => {
  return useQuery({
    ...getCoverLetterQueryOptions(id),
    ...queryConfig,
  });
};
