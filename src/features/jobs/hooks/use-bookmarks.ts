import { useCallback, useMemo } from "react";
import type { Job } from "@/types/job";
import { toast } from "sonner";
import { useUser } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useSavedJobs } from "../api/get-saved-jobs";
import { useToggleSavedJob } from "../api/toggle-saved-job";
import { useMassDeleteSavedJobs } from "../api/mass-delete-saved-jobs";

export function useBookmarks() {
  const { data: user } = useUser();

  const { data: savedJobsData, isLoading } = useSavedJobs({
    queryConfig: {
      enabled: !!user,
    },
  });

  const queryClient = useQueryClient();

  const toggleMutation = useToggleSavedJob({
    mutationConfig: {
      onSuccess: (response) => {
        const isSaved = response.is_saved;
        toast.success(
          isSaved
            ? "Lowongan berhasil disimpan"
            : "Lowongan dihapus dari daftar simpan"
        );
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      },
      onError: () => {
        toast.error("Gagal mengubah status penyimpanan lowongan");
      },
    },
  });

  const massDeleteMutation = useMassDeleteSavedJobs({
    mutationConfig: {
      onSuccess: (response) => {
        toast.success(
          `${response.deleted_count} lowongan tersimpan berhasil dihapus`
        );
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      },
      onError: () => {
        toast.error("Gagal menghapus lowongan tersimpan");
      },
    },
  });

  const bookmarks = useMemo(
    () => savedJobsData?.items || [],
    [savedJobsData]
  );

  const isBookmarked = useCallback(
    (jobId: string) => {
      return bookmarks.some((job: Job) => job.id === jobId);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (job: Job) => {
      if (!user) {
        toast.error("Silakan login terlebih dahulu untuk menyimpan lowongan");
        return;
      }
      toggleMutation.mutate({ id: job.id });
    },
    [user, toggleMutation]
  );

  const removeBookmark = useCallback(
    (jobId: string) => {
      if (!user) return;
      const job = bookmarks.find((j: Job) => j.id === jobId);
      if (job) {
        toggleMutation.mutate({ id: job.id });
      }
    },
    [user, bookmarks, toggleMutation]
  );

  const clearBookmarks = useCallback(() => {
    if (!user || bookmarks.length === 0) return;
    const jobIds = bookmarks.map((j: Job) => j.id);
    massDeleteMutation.mutate({ ids: jobIds });
  }, [user, bookmarks, massDeleteMutation]);

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearBookmarks,
    isToggling: toggleMutation.isPending,
    isClearing: massDeleteMutation.isPending,
  };
}
