import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Application } from "@/types/application";

export const getApplication = ({
  id,
}: {
  id: string;
}): Promise<Application> => {
  return api.get(`/applications/${id}`);
};

export const getApplicationQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["applications", id],
    queryFn: () => getApplication({ id }),
  });
};

type UseApplicationOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getApplicationQueryOptions>;
};

export const useApplication = ({
  id,
  queryConfig,
}: UseApplicationOptions) => {
  return useQuery({
    ...getApplicationQueryOptions(id),
    ...queryConfig,
  });
};
