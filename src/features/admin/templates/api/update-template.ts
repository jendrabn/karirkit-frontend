import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { DocumentTemplate } from "@/types/template";
import { createTemplateInputSchema } from "./create-template";

export type UpdateTemplateInput = z.infer<typeof createTemplateInputSchema>;

export const updateTemplate = ({
  data,
  id,
}: {
  data: UpdateTemplateInput;
  id: string;
}): Promise<DocumentTemplate> => {
  return api.put(`/admin/templates/${id}`, data);
};

type UseUpdateTemplateOptions = {
  mutationConfig?: MutationConfig<typeof updateTemplate>;
};

export const useUpdateTemplate = ({
  mutationConfig,
}: UseUpdateTemplateOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["templates", data.id],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTemplate,
  });
};
