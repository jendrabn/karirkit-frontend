import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export const downloadApplicationLetter = (
  id: string,
  format: "pdf" | "docx"
) => {
  return api.get(`/application-letters/${id}/download`, {
    params: { format },
    responseType: "blob",
  });
};

type UseDownloadApplicationLetterOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useDownloadApplicationLetter = (
  options?: UseDownloadApplicationLetterOptions
) => {
  return useMutation({
    mutationFn: ({
      id,
      format,
    }: {
      id: string;
      format: "pdf" | "docx";
      name?: string;
      subject?: string;
    }) => downloadApplicationLetter(id, format),
    onSuccess: (data, variables) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([data as any]));
      const link = document.createElement("a");
      link.href = url;
      const extension = variables.format;

      const safeName = (variables.name || "").replace(/\s+/g, "_");
      const safeSubject = (variables.subject || "").replace(/\s+/g, "_");
      const filename = `Surat_Lamaran_${safeName}_${safeSubject}`;

      link.setAttribute("download", `${filename}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up

      toast.success(
        `Berhasil mengunduh surat lamaran (${variables.format.toUpperCase()})`
      );
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      if (error.response?.status === 429) {
        toast.error("Batas unduhan harian tercapai. Silakan coba lagi besok.");
      } else {
        toast.error("Gagal mengunduh surat lamaran");
      }
      options?.onError?.();
    },
  });
};
