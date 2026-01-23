import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export type DownloadCVParams = {
  id: string;
  format: "pdf" | "docx";
};

export const downloadCV = (id: string, format: "pdf" | "docx") => {
  return api
    .get<Blob>(`/cvs/${id}/download`, {
      params: { format },
      responseType: "blob",
    })
    .then((response) => response.data);
};

type UseDownloadCVOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useDownloadCV = (options?: UseDownloadCVOptions) => {
  return useMutation({
    mutationFn: ({
      id,
      format,
    }: {
      id: string;
      format: "pdf" | "docx";
      name?: string;
      headline?: string;
    }) => downloadCV(id, format),
    onSuccess: (data, variables) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      const extension = variables.format;

      const safeName = (variables.name || "").replace(/\s+/g, "_");
      const safeHeadline = (variables.headline || "").replace(/\s+/g, "_");
      const filename = `CV_${safeName}_${safeHeadline}`;

      link.setAttribute("download", `${filename}.${extension}`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(
        `Berhasil mengunduh CV (${variables.format.toUpperCase()})`
      );
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 429) {
        toast.error("Batas unduhan harian tercapai. Silakan coba lagi besok.");
      } else {
        toast.error("Gagal mengunduh CV");
      }
      options?.onError?.();
    },
  });
};
