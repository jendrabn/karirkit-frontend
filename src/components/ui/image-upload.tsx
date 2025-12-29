import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { toast } from "sonner";
import { buildImageUrl } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Gambar",
  accept = "image/*",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    value ? buildImageUrl(value) : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        const imagePath = data.path;
        setPreview(buildImageUrl(imagePath));
        onChange(imagePath);
        toast.success("Gambar berhasil diupload");
      },
      onError: () => {
        toast.error("Gagal mengupload gambar");
      },
    },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Upload file menggunakan useUploadFile
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    setUrlInput("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("URL tidak boleh kosong");
      return;
    }

    // Validate URL format
    try {
      new URL(urlInput);
      setPreview(urlInput);
      onChange(urlInput);
      toast.success("URL gambar berhasil ditambahkan");
    } catch {
      toast.error("URL tidak valid");
    }
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={`${label} preview`}
            className="w-full h-48 object-cover rounded-lg border"
            onError={() => {
              setPreview(null);
              toast.error("Gagal memuat gambar");
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "upload" | "url")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-3">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                uploadMutation.isPending && "opacity-50 pointer-events-none"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="h-10 w-10 mx-auto mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Mengupload...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag & drop {label.toLowerCase()} atau klik untuk upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP (max 5MB)
                  </p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              disabled={uploadMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="url" className="mt-3">
            <div className="space-y-3">
              <div>
                <Label htmlFor="image-url">URL Gambar</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={handleUrlSubmit}
                className="w-full"
              >
                Gunakan URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
