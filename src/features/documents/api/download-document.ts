import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api-client";

export const downloadDocument = (id: string) => {
  return api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });
};

type UseDownloadDocumentOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useDownloadDocument = (options?: UseDownloadDocumentOptions) => {
  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      originalName?: string;
    }) => downloadDocument(id),
    onSuccess: (data, variables) => {
      const url = window.URL.createObjectURL(new Blob([data as any]));
      const link = document.createElement("a");
      link.href = url;

      const fallbackName = `document_${variables.id}`;
      const rawName =
        variables.originalName && variables.originalName.trim()
          ? variables.originalName.trim()
          : fallbackName;
      const safeName = rawName.replace(/[\\/:*?"<>|]+/g, "_");

      link.setAttribute("download", safeName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Berhasil mengunduh dokumen");
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal mengunduh dokumen");
      options?.onError?.();
    },
  });
};
