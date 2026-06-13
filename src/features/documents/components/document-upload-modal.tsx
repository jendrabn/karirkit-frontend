import * as React from "react";
import { useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
  type DocumentType,
  type DocumentCompressionLevel,
} from "@/types/document";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CompressionLevel = DocumentCompressionLevel;
type CompressionSelection = CompressionLevel | "none";

const compressionLabels: Record<CompressionLevel, string> = {
  light: "Ringan",
  medium: "Sedang",
  strong: "Kuat",
};

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (payload: {
    files: File[];
    type: DocumentType;
    compression?: CompressionLevel;
    name?: string;
  }) => Promise<void>;
}

export function DocumentUploadModal({
  open,
  onOpenChange,
  onUpload,
}: DocumentUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [selectedType, setSelectedType] = React.useState<DocumentType | "">("");
  const [compression, setCompression] =
    React.useState<CompressionSelection>("none");
  const [customName, setCustomName] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [typeError, setTypeError] = React.useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFiles = selectedFiles.length > 0;

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    setFileError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
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
    const nextFileError = !hasFiles ? "File dokumen wajib diupload" : null;
    const nextTypeError = !selectedType ? "Tipe dokumen wajib dipilih" : null;
    setFileError(nextFileError);
    setTypeError(nextTypeError);

    if (nextFileError || nextTypeError) {
      toast.error("Pilih file dan tipe dokumen");
      return;
    }

    setIsUploading(true);
    try {
      const documentType = selectedType as DocumentType;
      await onUpload({
        files: selectedFiles,
        type: documentType,
        compression: compression === "none" ? undefined : compression,
        name: customName.trim() ? customName.trim() : undefined,
      });
      toast.success("Dokumen berhasil diupload");
      handleClose();
    } catch {
      // Error details are handled by the API layer so server messages stay visible.
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setSelectedType("");
    setCompression("none");
    setCustomName("");
    setFileError(null);
    setTypeError(null);
    onOpenChange(false);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <form
        id="document-upload-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Dokumen</DialogTitle>
            <DialogDescription>
              Unggah dan kelola dokumen persyaratan kerja seperti ijazah, transkrip, sertifikat, KTP, SKCK, dan dokumen lainnya
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet>
              <Field>
                <FieldLabel>
                  File Dokumen <span className="text-destructive">*</span>
                </FieldLabel>
                <div
                  className={cn(
                    "relative rounded-lg transition-colors",
                    hasFiles
                      ? "border border-border p-3 bg-muted/40"
                      : "border-2 border-dashed p-8 text-center",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                    fileError && "border-destructive",
                  )}
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
                    multiple
                  />

                  {hasFiles ? (
                    <div className="space-y-3">
                      {selectedFiles.map((file, index) => {
                        return (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 w-full min-w-0 overflow-hidden"
                          >
                            <div className="min-w-0 flex-1 break-all">
                              <p className="text-sm font-medium max-w-full">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                      >
                        Tambah file
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
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => inputRef.current?.click()}
                          >
                            pilih file
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <FieldDescription>
                  Format yang didukung: gambar, PDF, dokumen teks, spreadsheet,
                  presentasi, video, dan audio. Maksimal 100 MB.
                </FieldDescription>
                <FieldError>{fileError}</FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Tipe Dokumen <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value as DocumentType);
                    setTypeError(null);
                  }}
                >
                  <SelectTrigger
                    className={cn(typeError && "border-destructive")}
                  >
                    <SelectValue placeholder="Pilih Tipe Dokumen" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {documentTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{typeError}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Nama Dokumen</FieldLabel>
                <Input
                  placeholder="Nama dokumen"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Level Kompresi</FieldLabel>
                <Select
                  value={compression}
                  onValueChange={(value) =>
                    setCompression(value as CompressionSelection)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Level Kompresi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa kompresi</SelectItem>
                    <SelectItem value="light">
                      {compressionLabels.light}
                    </SelectItem>
                    <SelectItem value="medium">
                      {compressionLabels.medium}
                    </SelectItem>
                    <SelectItem value="strong">
                      {compressionLabels.strong}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={handleClose}>
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="document-upload-form"
              disabled={!hasFiles || !selectedType || isUploading}
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
      </form>
    </Dialog>
  );
}
