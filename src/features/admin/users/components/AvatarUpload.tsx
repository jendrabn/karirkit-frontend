import { useState, useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, buildImageUrl } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { toast } from "sonner";

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  name?: string;
}

export function AvatarUpload({
  value,
  onChange,
  className,
  name,
}: AvatarUploadProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        onChange(data.path);
        setLocalPreview(null);
        toast.success("Avatar berhasil diupload");
      },
      onError: (error) => {
        console.error("Error: ", error);
        setLocalPreview(null);
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
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadFileMutation.mutate(file);
  };

  const isLoading = uploadFileMutation.isPending;
  const preview = localPreview ?? value ?? null;
  const imageSrc =
    preview?.startsWith("data:") || preview?.startsWith("http")
      ? preview
      : preview
        ? buildImageUrl(preview)
        : "";

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative group">
        <Avatar
          className="h-24 w-24 border-2 border-border cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <AvatarImage src={imageSrc || ""} className="object-cover" />
          <AvatarFallback className="bg-muted">
            {name ? (
              <span className="text-2xl font-semibold text-muted-foreground">
                {name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>

        <label
          className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-sm ring-2 ring-background z-10"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
