import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface DownloadStats {
  daily_limit: number;
  today_count: number;
  remaining: number;
}

export const getDownloadStats = (): Promise<DownloadStats> => {
  return api.get("/account/download-stats");
};

export const useDownloadStats = () => {
  return useQuery({
    queryKey: ["download-stats"],
    queryFn: getDownloadStats,
  });
};
