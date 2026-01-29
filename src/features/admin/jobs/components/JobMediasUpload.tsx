import { useRef } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/lib/upload";
import { buildImageUrl } from "@/lib/utils";
import { toast } from "sonner";

type JobMediaInput = {
  path: string;
};

interface JobMediasUploadProps {
  value?: JobMediaInput[];
  onChange: (value: JobMediaInput[]) => void;
}

export function JobMediasUpload({
  value = [],
  onChange,
}: JobMediasUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        onChange([...value, { path: data.path }]);
        toast.success("Media berhasil diupload");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
      onError: (error) => {
        console.error("Error: ", error);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    uploadMutation.mutate(file);
  };

  const handleRemove = (index: number) => {
    const next = value.filter((_, idx) => idx !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploadMutation.isPending}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((media, index) => (
          <div key={`${media.path}-${index}`} className="space-y-2">
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
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="h-32 border-dashed flex flex-col gap-2"
          onClick={() => inputRef.current?.click()}
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
