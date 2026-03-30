import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { AdminSubscription } from "@/types/subscription";

export const failAdminSubscription = ({
  id,
}: {
  id: string;
}): Promise<AdminSubscription> => {
  return api.patch(`/admin/subscriptions/${id}/fail`);
};

type UseFailAdminSubscriptionOptions = {
  mutationConfig?: MutationConfig<typeof failAdminSubscription>;
};

export const useFailAdminSubscription = ({
  mutationConfig,
}: UseFailAdminSubscriptionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: failAdminSubscription,
    onSuccess: async (data, ...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-subscriptions", data.id],
        }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
      ]);
      await onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
