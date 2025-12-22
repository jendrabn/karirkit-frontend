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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { useUploadFile } from "@/lib/upload";
import { createTemplateInputSchema, type CreateTemplateInput } from "../api/create-template";
import { TEMPLATE_TYPE_OPTIONS } from "@/types/template";

interface TemplateFormProps {
  initialData?: CreateTemplateInput;
  onSubmit: (data: CreateTemplateInput) => void;
  isLoading?: boolean;
}

export function TemplateForm({ initialData, onSubmit, isLoading }: TemplateFormProps) {
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

  const isUploading = uploadFileValidation.isPending || uploadPreviewValidation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Template *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bahasa *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bahasa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">Inggris</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nama Template *</FormLabel>
                        <FormControl>
                        <Input 
                            {...field} 
                            placeholder="Contoh: Simple Professional CV" 
                            onChange={(e) => {
                                field.onChange(e);
                                if (!initialData && !form.getValues("slug")) {
                                    const slug = e.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, "-")
                                        .replace(/(^-|-$)+/g, "");
                                    form.setValue("slug", slug);
                                }
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="contoh: simple-professional-cv" />
                        </FormControl>
                        <FormDescription>
                            URL-friendly identifier untuk template.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Premium</FormLabel>
                    <FormDescription>
                      Template ini hanya untuk pengguna premium
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
                control={form.control}
                name="preview"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preview Image *</FormLabel>
                        <FormControl>
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
                                    {uploadPreviewValidation.isPending ? "Uploading..." : "Upload Preview"}
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
                        </FormControl>
                        <FormDescription>
                            Format: JPG, PNG. Maks 5MB.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>File Template (.docx) *</FormLabel>
                         <FormControl>
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
                                    {uploadFileValidation.isPending ? "Uploading..." : "Upload File"}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".docx"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                             </div>
                         </FormControl>
                        <FormDescription>
                          Format: DOCX. Maks 10MB.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
        </Card>

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
            {isLoading ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
