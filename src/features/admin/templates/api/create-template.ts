import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Template } from "./get-templates";

export const createTemplateInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  type: z.enum(["cv", "application_letter"], {
    required_error: "Tipe wajib dipilih",
  }),
  language: z.enum(["en", "id"], {
    required_error: "Bahasa wajib dipilih",
  }),
  path: z.string().min(1, "Path file wajib diisi"),
  preview: z.string().min(1, "Preview image wajib diisi"),
  is_premium: z.boolean().default(false),
});

export type CreateTemplateInput = z.infer<typeof createTemplateInputSchema>;

export const createTemplate = ({
  data,
}: {
  data: CreateTemplateInput;
}): Promise<Template> => {
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
