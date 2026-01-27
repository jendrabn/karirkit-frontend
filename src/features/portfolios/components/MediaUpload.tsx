import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2 } from "lucide-react";
import { useUploadFile } from "@/lib/upload";
import { buildImageUrl } from "@/lib/utils";
import { toast } from "sonner";

interface Media {
  path: string;
  caption: string;
}

interface MediaUploadProps {
  value: Media[];
  onChange: (medias: Media[]) => void;
}

export function MediaUpload({ value, onChange }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        // Add new media with path from API response
        onChange([...value, { path: data.path, caption: "" }]);
        toast.success("Media berhasil diupload");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: () => {
        toast.error("Gagal mengupload media");
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

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Upload to server
    uploadMutation.mutate(file);
  };

  const handleRemove = (index: number) => {
    const newMedias = value.filter((_, i) => i !== index);
    onChange(newMedias);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newMedias = value.map((media, i) =>
      i === index ? { ...media, caption } : media,
    );
    onChange(newMedias);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploadMutation.isPending}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((media, index) => (
          <div key={index} className="space-y-2">
            <div className="relative">
              <img
                src={buildImageUrl(media.path)}
                alt={`Media ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemove(index)}
                disabled={uploadMutation.isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Input
              placeholder="Caption"
              value={media.caption}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              disabled={uploadMutation.isPending}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="h-32 border-dashed flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">
                Mengupload...
              </span>
            </>
          ) : (
            <>
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Tambah Media
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
