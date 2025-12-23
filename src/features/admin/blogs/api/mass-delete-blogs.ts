import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteBlogs = ({ ids }: { ids: string[] }) => {
  return api.delete(`/admin/blogs/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteBlogsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteBlogs>;
};

export const useMassDeleteBlogs = ({
  mutationConfig,
}: UseMassDeleteBlogsOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-blogs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteBlogs,
  });
};
