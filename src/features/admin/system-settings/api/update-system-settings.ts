import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
  SystemSettingsListResponse,
  UpdateSystemSettingsPayload,
} from "@/types/system-settings";

export const updateSystemSettings = (
  data: UpdateSystemSettingsPayload,
): Promise<SystemSettingsListResponse> => {
  return api.put("/admin/system-settings", data);
};

type UseUpdateSystemSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateSystemSettings>;
};

export const useUpdateSystemSettings = ({
  mutationConfig,
}: UseUpdateSystemSettingsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(["admin-system-settings"], data);
      queryClient.invalidateQueries({ queryKey: ["admin-system-settings"] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
