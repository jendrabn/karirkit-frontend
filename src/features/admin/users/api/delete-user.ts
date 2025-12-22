import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteUser = ({ id }: { id: string }) => {
  return api.delete(`/admin/users/${id}`);
};

type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ mutationConfig }: UseDeleteUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUser,
  });
};
