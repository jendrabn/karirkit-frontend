import { api } from "@/lib/api-client";

export type DownloadCVParams = {
  id: string;
  format: "pdf" | "docx";
};

export const downloadCV = async ({
  id,
  format,
}: DownloadCVParams): Promise<Blob> => {
  const response = await api.get(`/cvs/${id}/download`, {
    params: { format },
    responseType: "blob",
  });

  return response as unknown as Blob;
};

export const useDownloadCV = () => {
  const handleDownload = async (id: string, format: "pdf" | "docx") => {
    try {
      const blob = await downloadCV({ id, format });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cv-${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  };

  return { downloadCV: handleDownload };
};
