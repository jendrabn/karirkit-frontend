import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { DocumentTemplate } from "@/types/template";

export const createTemplateInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  type: z.enum(["cv", "application_letter"], {
    message: "Tipe wajib dipilih",
  }),
  language: z.enum(["en", "id"], {
    message: "Bahasa wajib dipilih",
  }),
  path: z.string().min(1, "Path file wajib diisi"),
  preview: z.string().min(1, "Preview image wajib diisi"),
  is_premium: z.boolean().default(false),
});

export type CreateTemplateInput = z.infer<typeof createTemplateInputSchema>;
export type CreateTemplateFormInput = z.input<typeof createTemplateInputSchema>;

export const createTemplate = (
  data: CreateTemplateInput
): Promise<DocumentTemplate> => {
  return api.post("/admin/templates", data);
};

type UseCreateTemplateOptions = {
  mutationConfig?: MutationConfig<typeof createTemplate>;
};

export const useCreateTemplate = ({
  mutationConfig,
}: UseCreateTemplateOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createTemplate,
  });
};
