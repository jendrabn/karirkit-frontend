import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { toast } from "sonner";

interface CoverUploadProps {
  value?: string;
  onChange: (path: string) => void;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setIsUploading(true);

    try {
      // Simulate upload - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock response - in real implementation, this would be the path from API
      const mockPath = URL.createObjectURL(file);
      onChange(mockPath);
      toast.success("Cover berhasil diupload");
    } catch (error) {
      toast.error("Gagal mengupload cover");
    } finally {
      setIsUploading(false);
    }
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
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
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
          disabled={isUploading}
        >
          {isUploading ? (
            <span>Mengupload...</span>
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
