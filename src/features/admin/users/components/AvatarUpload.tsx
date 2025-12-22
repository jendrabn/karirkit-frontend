import { useState, useRef } from "react";
import { Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { toast } from "sonner";

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AvatarUpload({ value, onChange, className }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        onChange(data.path);
        toast.success("Avatar berhasil diupload");
      },
      onError: () => {
        toast.error("Gagal mengupload avatar");
        // Revert preview if needed, or just let it stay?
        // Maybe clear preview if upload fails
        setPreview(value || null);
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

    // Set preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadFileMutation.mutate(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isLoading = uploadFileMutation.isPending;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <Avatar className="h-24 w-24 border-2 border-border">
        <AvatarImage src={preview || value} />
        <AvatarFallback className="bg-muted">
          <User className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? "Uploading..." : "Upload"}
        </Button>

        {(preview || value) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center">
        Format: JPG, PNG, GIF. Maksimal 2MB
      </p>
    </div>
  );
}
