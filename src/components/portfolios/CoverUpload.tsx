import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Image, Loader2 } from "lucide-react";
import { useUploadFile } from "@/lib/upload";
import { buildImageUrl } from "@/lib/utils";
import { toast } from "sonner";

interface CoverUploadProps {
  value?: string;
  onChange: (path: string) => void;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        // Set the path from API response
        onChange(data.path);
        toast.success("Cover berhasil diupload");
      },
      onError: () => {
        toast.error("Gagal mengupload cover");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Upload to server
    uploadMutation.mutate(file);
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploadMutation.isPending}
      />

      {value ? (
        <div className="relative">
          <img
            src={buildImageUrl(value)}
            alt="Cover preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={uploadMutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-dashed flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <span className="text-muted-foreground">Mengupload...</span>
            </>
          ) : (
            <>
              <Image className="h-8 w-8 text-muted-foreground" />
              <span className="text-muted-foreground">Klik untuk upload cover</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
