import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Portfolio } from "./get-portfolios";

export type CreatePortfolioInput = {
  title: string;
  sort_description: string;
  description: string;
  role_title: string;
  project_type: "work" | "freelance" | "personal" | "academic";
  industry: string;
  month: number;
  year: number;
  live_url?: string;
  repo_url?: string;
  cover?: string;
  tools?: string[];
  medias?: {
    path: string;
    caption: string;
  }[];
};

export const portfolioSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  sort_description: z.string().min(1, "Deskripsi singkat wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  role_title: z.string().min(1, "Role wajib diisi"),
  project_type: z.enum(["work", "personal", "freelance", "academic"], {
    message: "Tipe proyek wajib dipilih",
  }),
  industry: z.string().min(1, "Industri wajib diisi"),
  month: z.number().min(1).max(12),
  year: z.number().min(1900).max(2100),
  live_url: z.string().optional().nullable(),
  repo_url: z.string().optional().nullable(),
  cover: z.string().optional().nullable(),
  tools: z.array(z.string()).optional(),
  medias: z
    .array(
      z.object({
        path: z.string().min(1, "Path media wajib diisi"),
        caption: z.string().optional().nullable(),
      })
    )
    .optional(),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;

export type CreatePortfolioResponse = Portfolio;

export const createPortfolio = (
  data: CreatePortfolioInput
): Promise<CreatePortfolioResponse> => {
  return api.post("/portfolios", data);
};

type UseCreatePortfolioOptions = {
  mutationConfig?: MutationConfig<typeof createPortfolio>;
};

export const useCreatePortfolio = ({
  mutationConfig,
}: UseCreatePortfolioOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
