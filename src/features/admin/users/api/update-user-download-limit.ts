import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export const updateDownloadLimit = ({
  id,
  daily_download_limit,
}: {
  id: string;
  daily_download_limit: number;
}) => {
  return api.patch(`/admin/users/${id}/download-limit`, {
    daily_download_limit,
  });
};

export const useUpdateUserDownloadLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDownloadLimit,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        `Berhasil mengupdate batas unduhan untuk user (Limit: ${variables.daily_download_limit})`
      );
    },
    onError: () => {
      toast.error("Gagal mengupdate batas unduhan user");
    },
  });
};
