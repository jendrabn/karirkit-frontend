import { useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Blog,
  type BlogCategory,
  type BlogTag,
  BLOG_STATUS_OPTIONS,
} from "@/types/blog";
import { toast } from "sonner";
import { buildImageUrl, cn } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";
import { blogSchema, type BlogFormData } from "../api/create-blog";
import { QuillEditor } from "@/features/admin/blogs/components/QuillEditor";

// Main BlogForm Component
interface BlogFormProps {
  initialData?: Partial<Blog>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  categories: BlogCategory[];
  tags: BlogTag[];
  error?: unknown;
}

export function BlogForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  categories,
  tags,
  error,
}: BlogFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    buildImageUrl(initialData?.image) || null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags?.map((t) => t.id.toString()) || [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileMutation = useUploadFile();
  const tagAnchor = useComboboxAnchor();

  const categoryLabelById = useMemo(
    () =>
      new Map(
        categories.map((category) => [category.id.toString(), category.name]),
      ),
    [categories],
  );
  const tagById = useMemo(
    () => new Map(tags.map((tag) => [tag.id.toString(), tag])),
    [tags],
  );

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || "",
      featured_image: initialData?.image || null,
      content: initialData?.content || "",
      excerpt: initialData?.teaser || "",
      status: (initialData?.status as "draft" | "published" | "archived") || "",
      category_id: initialData?.category?.id?.toString() || "",
      tag_ids: initialData?.tags?.map((t) => t.id.toString()) || [],
    },
  });

  useServerValidation(error, form);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingImage(true);
    const loadingToast = toast.loading("Mengupload gambar...");

    try {
      const response = await uploadFileMutation.mutateAsync(file);
      const imageUrl = buildImageUrl(response.path);
      setImagePreview(imageUrl);
      form.setValue("featured_image", response.path);
      toast.dismiss(loadingToast);
      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Gagal mengupload gambar");
      console.error("Upload error:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("featured_image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTagsChange = (values: string[] | null) => {
    const nextTags = values ?? [];
    setSelectedTags(nextTags);
    form.setValue("tag_ids", nextTags);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, displayFormErrors)}>
      <FieldSet
        disabled={isLoading || isUploadingImage}
        className="space-y-8 mb-6"
      >
        {/*  Informasi Dasar Blog  */}
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? "Edit Blog" : "Tambah Blog"}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Judul */}
            <Field>
              <FieldLabel>
                Judul <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...form.register("title", {
                  onChange: handleTitleChange,
                })}
                placeholder="Contoh: 7 Tips Lolos Interview Frontend Developer"
                className={cn(
                  form.formState.errors.title && "border-destructive",
                )}
              />
              <FieldError>{form.formState.errors.title?.message}</FieldError>
            </Field>

            {/* Kategori & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Kategori</FieldLabel>
                    <Combobox
                      items={categories.map((category) =>
                        category.id.toString(),
                      )}
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      itemToStringLabel={(value) =>
                        categoryLabelById.get(value as string) ?? ""
                      }
                    >
                      <ComboboxInput
                        className="w-full"
                        placeholder="Pilih Kategori Blog"
                        aria-invalid={!!form.formState.errors.category_id}
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>Kategori tidak ditemukan.</ComboboxEmpty>
                        <ComboboxList>
                          {(categoryId) => (
                            <ComboboxItem key={categoryId} value={categoryId}>
                              {categoryLabelById.get(categoryId) ?? ""}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError>
                      {form.formState.errors.category_id?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Status <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.status && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Status Blog" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.status?.message}
                    </FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/*  Tags & Metadata  */}
        <Card>
          <CardHeader>
            <CardTitle>Tag & Metadata</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Tags */}
            <Field className="space-y-2">
              <FieldLabel>Tags</FieldLabel>
              <Combobox
                multiple
                items={tags.map((tag) => tag.id.toString())}
                value={selectedTags}
                onValueChange={(values) =>
                  handleTagsChange(values as string[] | null)
                }
                itemToStringLabel={(value) =>
                  tagById.get(value as string)?.name ?? ""
                }
              >
                <ComboboxChips
                  ref={tagAnchor}
                  className="w-full"
                  aria-invalid={!!form.formState.errors.tag_ids}
                >
                  <ComboboxValue>
                    {(values) => (
                      <>
                        {values.map((tagId: string) => {
                          const tag = tagById.get(tagId);
                          if (!tag) return null;
                          return (
                            <ComboboxChip key={tagId}>{tag.name}</ComboboxChip>
                          );
                        })}
                        <ComboboxChipsInput placeholder="Cari tag..." />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={tagAnchor}>
                  <ComboboxEmpty>Tidak ada tag ditemukan.</ComboboxEmpty>
                  <ComboboxList>
                    {(tagId) => (
                      <ComboboxItem key={tagId} value={tagId}>
                        {tagById.get(tagId)?.name ?? ""}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <FieldError>{form.formState.errors.tag_ids?.message}</FieldError>
            </Field>

            {/* Excerpt */}
            <Field>
              <FieldLabel>Excerpt / Ringkasan</FieldLabel>
              <Textarea
                {...form.register("excerpt")}
                placeholder="Ringkasan singkat yang muncul di halaman listing blog"
                rows={3}
                className={cn(
                  form.formState.errors.excerpt && "border-destructive",
                )}
              />
              <FieldError>{form.formState.errors.excerpt?.message}</FieldError>
            </Field>
          </CardContent>
        </Card>

        {/*  Media  */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Image Upload */}
            <Field className="space-y-2">
              <FieldLabel>Gambar Cover</FieldLabel>

              <div className="border-2 border-dashed rounded-lg p-6">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      disabled={isUploadingImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer py-10"
                    onClick={() =>
                      !isUploadingImage && fileInputRef.current?.click()
                    }
                  >
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isUploadingImage
                        ? "Mengupload gambar..."
                        : "Klik untuk upload gambar cover"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, JPEG (maks. 5MB)
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </div>
              <FieldError>
                {form.formState.errors.featured_image?.message}
              </FieldError>
            </Field>
          </CardContent>
        </Card>

        {/*  Konten  */}
        <Card>
          <CardHeader>
            <CardTitle>Konten Blog</CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    Konten <span className="text-destructive">*</span>
                  </FieldLabel>
                  <QuillEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Tulis konten blog secara lengkap di sini..."
                  />
                  <FieldError>
                    {form.formState.errors.content?.message}
                  </FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>
      </FieldSet>

      {/*  Action  */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>

        <Button type="submit" disabled={isLoading || isUploadingImage}>
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Menyimpan...
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
