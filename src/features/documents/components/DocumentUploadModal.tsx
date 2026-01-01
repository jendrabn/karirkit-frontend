import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  documentTypes,
  documentTypeLabels,
  DocumentType,
  DocumentCompressionLevel,
} from "@/types/document";
import { Field, FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";

export type CompressionLevel = DocumentCompressionLevel;

const compressionLabels: Record<CompressionLevel, string> = {
  auto: "Otomatis",
  light: "Ringan",
  medium: "Sedang",
  strong: "Kuat",
};

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (
    file: File,
    type: DocumentType,
    compression?: CompressionLevel
  ) => Promise<void>;
}

export function DocumentUploadModal({
  open,
  onOpenChange,
  onUpload,
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | "">("");
  const [compression, setCompression] = useState<CompressionLevel | "">("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImageFile = selectedFile?.type.startsWith("image/");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan PDF, JPG, PNG, WEBP, DOC, DOCX, XLS, atau XLSX.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 25MB");
      return;
    }

    setSelectedFile(file);
    // Reset compression when file changes
    setCompression("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedType) {
      toast.error("Pilih file dan tipe dokumen");
      return;
    }

    setIsUploading(true);
    try {
      // Pass compression only for image files
      const compressionValue =
        isImageFile && compression ? compression : undefined;
      await onUpload(selectedFile, selectedType, compressionValue);
      toast.success("Dokumen berhasil diupload");
      handleClose();
    } catch (error) {
      toast.error("Gagal mengupload dokumen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedType("");
    setCompression("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Dokumen</DialogTitle>
        </DialogHeader>

        <FieldSet className="space-y-4 py-4">
          <Field>
            <FieldLabel>File Dokumen *</FieldLabel>
            <div
              className={`relative rounded-lg transition-colors ${
                selectedFile
                  ? "border border-border p-3 bg-muted/40"
                  : "border-2 border-dashed p-8 text-center"
              } ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {isImageFile ? (
                        <ImageIcon className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Drag & drop file atau{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => inputRef.current?.click()}
                      >
                        pilih file
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG, WEBP, DOC, DOCX, XLS, XLSX (Maks. 25MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <FieldDescription>
              PDF, JPG, PNG, WEBP, DOC, DOCX, XLS, XLSX (Maks. 25MB)
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>
              Tipe Dokumen <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as DocumentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe dokumen" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {documentTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {isImageFile && (
            <Field>
              <FieldLabel>Kompresi Gambar (Opsional)</FieldLabel>
              <Select
                value={compression}
                onValueChange={(value) =>
                  setCompression(value as CompressionLevel)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih level kompresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{compressionLabels.auto}</SelectItem>
                  <SelectItem value="light">{compressionLabels.light}</SelectItem>
                  <SelectItem value="medium">{compressionLabels.medium}</SelectItem>
                  <SelectItem value="strong">{compressionLabels.strong}</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Kompresi dapat mengurangi ukuran file gambar untuk upload lebih cepat.
              </FieldDescription>
            </Field>
          )}
        </FieldSet>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedType || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
