import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { getFileIconFromFile } from "@/features/documents/utils/file-icons";
import { cn } from "@/lib/utils";

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
  onUpload: (payload: {
    files: File[];
    type: DocumentType;
    compression?: CompressionLevel;
    merge?: boolean;
    name?: string;
  }) => Promise<void>;
}

export function DocumentUploadModal({
  open,
  onOpenChange,
  onUpload,
}: DocumentUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType | "">("");
  const [compression, setCompression] = useState<CompressionLevel | "">("");
  const [mergeFiles, setMergeFiles] = useState(false);
  const [customName, setCustomName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFiles = selectedFiles.length > 0;
  const isImageFile = selectedFiles.some((file) =>
    file.type.startsWith("image/"),
  );
  const isPdfFile = selectedFiles.some(
    (file) =>
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf"),
  );
  const isCompressibleFile = isImageFile || isPdfFile;

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
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/rtf",
    ];

    const incomingFiles = Array.from(files);
    const validFiles: File[] = [];
    let hasInvalidType = false;
    let hasOversize = false;

    incomingFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        hasInvalidType = true;
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        hasOversize = true;
        return;
      }
      validFiles.push(file);
    });

    if (hasInvalidType) {
      toast.error(
        "Tipe file tidak didukung. Gunakan JPG, JPEG, PNG, GIF, WEBP, SVG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, atau RTF.",
      );
    }

    if (hasOversize) {
      toast.error("Ukuran file maksimal 25MB");
    }

    if (validFiles.length === 0) {
      return;
    }

    setSelectedFiles((prev) => {
      const next = [...prev, ...validFiles];
      if (next.length <= 1) {
        setMergeFiles(false);
      }
      return next;
    });
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
    const nextFileError = !hasFiles
      ? "File dokumen wajib diupload"
      : null;
    const nextTypeError = !selectedType ? "Tipe dokumen wajib dipilih" : null;
    setFileError(nextFileError);
    setTypeError(nextTypeError);

    if (nextFileError || nextTypeError) {
      toast.error("Pilih file dan tipe dokumen");
      return;
    }

    setIsUploading(true);
    try {
      // Pass compression only for image files
      const compressionValue =
        isCompressibleFile && compression ? compression : undefined;
      const documentType = selectedType as DocumentType;
      await onUpload({
        files: selectedFiles,
        type: documentType,
        compression: compressionValue,
        merge: selectedFiles.length > 1 ? mergeFiles : undefined,
        name: customName.trim() ? customName.trim() : undefined,
      });
      toast.success("Dokumen berhasil diupload");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Gagal mengupload dokumen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setSelectedType("");
    setCompression("");
    setMergeFiles(false);
    setCustomName("");
    setFileError(null);
    setTypeError(null);
    onOpenChange(false);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length <= 1) {
        setMergeFiles(false);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl p-0 gap-0">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col max-h-[85vh]"
        >
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Upload Dokumen</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
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
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
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
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                {getFileIconFromFile(file)}
                              </div>
                              <div className="min-w-0 flex-1 break-all">
                                <p className="text-sm font-medium max-w-full">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
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
                  JPG, JPEG, PNG, GIF, WEBP, SVG, PDF, DOC, DOCX, XLS, XLSX,
                  PPT, PPTX, TXT, RTF (Maks. 25MB)
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

              {selectedFiles.length > 1 && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Gabungkan Semua File
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Satukan {selectedFiles.length} file menjadi satu dokumen
                        PDF
                      </p>
                    </div>
                    <Switch
                      checked={mergeFiles}
                      onCheckedChange={setMergeFiles}
                      className="mt-0.5"
                    />
                  </div>
                </div>
              )}

              {isCompressibleFile && (
                <Field>
                  <FieldLabel>Kompresi File</FieldLabel>
                  <Select
                    value={compression}
                    onValueChange={(value) =>
                      setCompression(value as CompressionLevel)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Level Kompresi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        {compressionLabels.auto}
                      </SelectItem>
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
              )}
            </FieldSet>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={handleClose}>
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
