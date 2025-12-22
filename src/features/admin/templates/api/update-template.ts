import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Template } from "./get-templates";
import { createTemplateInputSchema } from "./create-template";

export const updateTemplateInputSchema = createTemplateInputSchema;

export type UpdateTemplateInput = z.infer<typeof updateTemplateInputSchema>;

export const updateTemplate = ({
  data,
  id,
}: {
  data: UpdateTemplateInput;
  id: string;
}): Promise<Template> => {
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
      queryClient.refetchQueries({
        queryKey: ["templates", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTemplate,
  });
};
