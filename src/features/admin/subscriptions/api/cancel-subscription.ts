import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { AdminSubscription } from "@/types/subscription";

export const cancelAdminSubscription = ({
  id,
}: {
  id: string;
}): Promise<AdminSubscription> => {
  return api.patch(`/admin/subscriptions/${id}/cancel`);
};

type UseCancelAdminSubscriptionOptions = {
  mutationConfig?: MutationConfig<typeof cancelAdminSubscription>;
};

export const useCancelAdminSubscription = ({
  mutationConfig,
}: UseCancelAdminSubscriptionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: cancelAdminSubscription,
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
