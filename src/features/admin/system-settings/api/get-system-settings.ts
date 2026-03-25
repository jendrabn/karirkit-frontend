import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { SystemSettingsListResponse } from "@/types/system-settings";

export const getSystemSettings =
  (): Promise<SystemSettingsListResponse> => {
    return api.get("/admin/system-settings");
  };

export const getSystemSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin-system-settings"],
    queryFn: getSystemSettings,
  });

type UseSystemSettingsOptions = {
  queryConfig?: QueryConfig<typeof getSystemSettingsQueryOptions>;
};

export const useSystemSettings = ({
  queryConfig,
}: UseSystemSettingsOptions = {}) => {
  return useQuery({
    ...getSystemSettingsQueryOptions(),
    ...queryConfig,
  });
};
