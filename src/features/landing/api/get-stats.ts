import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";

type Stats = {
  total_users: number;
  total_cvs: number;
  total_application_letters: number;
  total_applications: number;
  total_cv_templates: number;
  total_application_letter_templates: number;
};

export const getStats = (): Promise<Stats> => {
  return api.get("/stats");
};

export const getStatsOptions = () => {
  return queryOptions({
    queryKey: ["stats"],
    queryFn: () => getStats(),
  });
};

export const useStats = () => {
  return useQuery({
    ...getStatsOptions(),
  });
};
