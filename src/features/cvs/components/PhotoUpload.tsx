import { useState, useRef } from "react";
import { Upload, X, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, buildImageUrl } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { toast } from "sonner";

interface PhotoUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string>(value ? buildImageUrl(value) : "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        // Set the path from API response
        onChange(data.path);
        setPreview(buildImageUrl(data.path));
        toast.success("Foto berhasil diunggah");
      },
      onError: () => {
        toast.error("Gagal mengunggah foto");
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

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    // Upload to server
    uploadMutation.mutate(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>Foto (Opsional)</Label>
      
      <div className="flex items-start gap-4">
        <div 
          className={cn(
            "w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/50",
            !preview && "border-muted-foreground/25",
            uploadMutation.isPending && "opacity-50"
          )}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground/50" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadMutation.isPending}
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadMutation.isPending 
              ? "Mengunggah..." 
              : preview 
              ? "Ganti Foto" 
              : "Unggah Foto"
            }
          </Button>

          {preview && !uploadMutation.isPending && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          )}

          <p className="text-xs text-muted-foreground">
            Format: JPG, PNG. Maks 2MB
          </p>
        </div>
      </div>
    </div>
  );
}
