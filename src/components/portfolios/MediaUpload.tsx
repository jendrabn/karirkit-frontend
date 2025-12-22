import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Image } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setIsUploading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockPath = URL.createObjectURL(file);
      onChange([...value, { path: mockPath, caption: "" }]);
      toast.success("Media berhasil diupload");
    } catch (error) {
      toast.error("Gagal mengupload media");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newMedias = value.filter((_, i) => i !== index);
    onChange(newMedias);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newMedias = value.map((media, i) =>
      i === index ? { ...media, caption } : media
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
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((media, index) => (
          <div key={index} className="space-y-2">
            <div className="relative">
              <img
                src={media.path}
                alt={`Media ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Input
              placeholder="Caption (opsional)"
              value={media.caption}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="h-32 border-dashed flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="text-sm">Mengupload...</span>
          ) : (
            <>
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tambah Media</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
