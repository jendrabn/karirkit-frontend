import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApplicationLetter } from "./get-application-letters";

export type ApplicationLetterResponse = ApplicationLetter;

export const getApplicationLetter = (id: string): Promise<ApplicationLetterResponse> => {
  return api.get(`/application-letters/${id}`);
};

export const getApplicationLetterQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["application-letter", id],
    queryFn: () => getApplicationLetter(id),
  });
};

type UseApplicationLetterOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getApplicationLetterQueryOptions>;
};

export const useApplicationLetter = ({
  id,
  queryConfig,
}: UseApplicationLetterOptions) => {
  return useQuery({
    ...getApplicationLetterQueryOptions(id),
    ...queryConfig,
  });
};
