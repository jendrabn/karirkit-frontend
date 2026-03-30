import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MySubscription } from "@/types/subscription";

export const cancelSubscription = (id: string): Promise<MySubscription> => {
  return api.delete(`/subscriptions/${id}`);
};

type UseCancelSubscriptionOptions = {
  mutationConfig?: MutationConfig<typeof cancelSubscription>;
};

export const useCancelSubscription = ({
  mutationConfig,
}: UseCancelSubscriptionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["subscription-plans"] }),
      ]);
      await onSuccess?.(...args);
    },
    ...restConfig,
  });
};
