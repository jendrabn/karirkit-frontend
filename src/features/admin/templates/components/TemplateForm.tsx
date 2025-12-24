import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { useUploadFile } from "@/lib/upload";
import {
  createTemplateInputSchema,
  type CreateTemplateInput,
} from "../api/create-template";
import { TEMPLATE_TYPE_OPTIONS } from "@/types/template";
import { useFormErrors } from "@/hooks/use-form-errors";

interface TemplateFormProps {
  initialData?: CreateTemplateInput;
  onSubmit: (data: CreateTemplateInput) => void;
  isLoading?: boolean;
}

export function TemplateForm({
  initialData,
  onSubmit,
  isLoading,
}: TemplateFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateInputSchema) as any,
    defaultValues: initialData || {
      name: "",
      slug: "",
      type: "cv",
      language: "id",
      is_premium: false,
      path: "",
      preview: "",
    },
  });

  // Handle form validation errors from API
  useFormErrors(form);

  const uploadFileValidation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        form.setValue("path", data.path);
        form.trigger("path");
        toast.success("File template berhasil diupload");
      },
      onError: () => {
        toast.error("Gagal mengupload file template");
      },
    },
  });

  const uploadPreviewValidation = useUploadFile({
    mutationConfig: {
      onSuccess: (data) => {
        form.setValue("preview", data.path);
        form.trigger("preview");
        toast.success("Preview image berhasil diupload");
      },
      onError: () => {
        toast.error("Gagal mengupload preview image");
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".docx")) {
        toast.error("File harus berformat .docx");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 10MB");
        return;
      }
      uploadFileValidation.mutate(file);
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      uploadPreviewValidation.mutate(file);
    }
  };

  const isUploading =
    uploadFileValidation.isPending || uploadPreviewValidation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldSet disabled={isLoading || isUploading} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tipe Template *</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.type?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="language"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Bahasa *</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bahasa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">Inggris</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.language?.message}
                    </FieldError>
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Nama Template *</FieldLabel>
                <Input
                  {...form.register("name", {
                    onChange: (e) => {
                      if (!initialData && !form.getValues("slug")) {
                        const slug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)+/g, "");
                        form.setValue("slug", slug);
                      }
                    },
                  })}
                  placeholder="Contoh: Simple Professional CV"
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Slug *</FieldLabel>
                <Input
                  {...form.register("slug")}
                  placeholder="contoh: simple-professional-cv"
                />
                <FieldDescription>
                  URL-friendly identifier untuk template.
                </FieldDescription>
                <FieldError>{form.formState.errors.slug?.message}</FieldError>
              </Field>
            </div>

            <Controller
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <Field
                  orientation="horizontal"
                  className="flex flex-row items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-0.5">
                    <FieldLabel className="text-base">Premium</FieldLabel>
                    <FieldDescription>
                      Template ini hanya untuk pengguna premium
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              control={form.control}
              name="preview"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Preview Image *</FieldLabel>
                  <div className="flex items-start gap-4">
                    {field.value && (
                      <div className="relative">
                        <img
                          src={field.value}
                          alt="Preview"
                          className="w-32 h-40 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => field.onChange("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div
                      className="flex flex-col items-center justify-center w-32 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => previewInputRef.current?.click()}
                    >
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground text-center">
                        {uploadPreviewValidation.isPending
                          ? "Uploading..."
                          : "Upload Preview"}
                      </span>
                    </div>
                    <input
                      ref={previewInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePreviewChange}
                    />
                  </div>
                  <FieldDescription>
                    Format: JPG, PNG. Maks 5MB.
                  </FieldDescription>
                  <FieldError>
                    {form.formState.errors.preview?.message}
                  </FieldError>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="path"
              render={({ field }) => (
                <Field>
                  <FieldLabel>File Template (.docx) *</FieldLabel>
                  <div className="flex items-center gap-4">
                    {field.value && (
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {field.value.split("/").pop()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => field.onChange("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadFileValidation.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadFileValidation.isPending
                        ? "Uploading..."
                        : "Upload File"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <FieldDescription>Format: DOCX. Maks 10MB.</FieldDescription>
                  <FieldError>{form.formState.errors.path?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>
      </FieldSet>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/templates")}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading
            ? "Menyimpan..."
            : initialData
            ? "Simpan Perubahan"
            : "Buat Template"}
        </Button>
      </div>
    </form>
  );
}
