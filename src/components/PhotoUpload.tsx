import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldLabel } from "@/components/ui/field";
import { buildImageUrl } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { toast } from "sonner";

interface PhotoUploadProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  quality?: number;
  webp?: boolean;
  format?: string;
}

export function PhotoUpload({
  value,
  onChange,
  name,
  quality,
  webp,
  format,
}: PhotoUploadProps) {
  const preview = value ? buildImageUrl(value) : "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        onChange(data.path);
        toast.success("Foto berhasil diunggah");
      },
      onError: () => {
        toast.error("Gagal mengunggah foto");
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

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    uploadMutation.mutate({
      file,
      quality,
      webp,
      format,
    });
  };

  // const handleRemove = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setPreview("");
  //   onChange("");
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Field className="w-fit flex flex-col items-center gap-4">
      <FieldLabel className="self-start">Foto</FieldLabel>
      <div className="relative group cursor-pointer" onClick={triggerUpload}>
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={preview} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
            {name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Upload Overlay/Button */}
        <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm ring-2 ring-background">
          {uploadMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </div>

        {/* Remove Button (Only show when value exists and not loading) */}
        {/* {value && !uploadMutation.isPending && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Hapus foto</span>
          </Button>
        )} */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
        />
      </div>
    </Field>
  );
}
