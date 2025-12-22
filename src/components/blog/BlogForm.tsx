import { useState, useRef, useEffect, useLayoutEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { X, Image as ImageIcon, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import {
  type Blog,
  type BlogCategory,
  type BlogTag,
  BLOG_STATUS_OPTIONS,
} from "@/types/blog";
import { toast } from "sonner";
import { buildImageUrl, cn } from "@/lib/utils";
import { useUploadFile } from "@/lib/upload";
import { useUploadBlogFile } from "@/features/admin/blogs/api/upload-blog-file";

const blogSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  featured_image: z.string().nullable().optional(),
  image_caption: z.string().nullable().optional(),
  content: z.string().min(1, "Konten wajib diisi"),
  excerpt: z.string().nullable().optional(),
  read_time: z.number().min(1, "Waktu baca minimal 1 menit"),
  status: z.enum(["draft", "published", "archived"]),
  category_id: z.string().nullable().optional(),
  tag_ids: z.array(z.string()).optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

// QuillEditor Component with upload blog file hook
interface QuillEditorProps {
  defaultValue?: string;
  onTextChange?: (html: string) => void;
  placeholder?: string;
}

const QuillEditor = forwardRef<Quill | null, QuillEditorProps>(
  ({ defaultValue, onTextChange, placeholder }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onTextChangeRef = useRef(onTextChange);
    const uploadBlogFileMutation = useUploadBlogFile();

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div')
      );

      const imageHandler = async function(this: any) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB');
            return;
          }

          const quill = (ref as React.MutableRefObject<Quill | null>)?.current;
          if (!quill) return;

          const range = quill.getSelection(true);
          const loadingToast = toast.loading('Mengupload gambar...');
          
          try {
            const response = await uploadBlogFileMutation.mutateAsync(file);
            quill.insertEmbed(range.index, 'image', buildImageUrl(response.path));
            quill.setSelection(range.index + 1, 0);
            toast.dismiss(loadingToast);
            toast.success('Gambar berhasil diupload');
          } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Gagal mengupload gambar');
            console.error('Upload error:', error);
          }
        };
      };

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ align: [] }],
              ["link", "image"],
              ["blockquote", "code-block"],
              [{ color: [] }, { background: [] }],
              ["clean"],
            ],
            handlers: { image: imageHandler },
          },
        },
        placeholder: placeholder || "Start writing...",
      });

      if (ref) {
        typeof ref === 'function' ? ref(quill) : (ref.current = quill);
      }

      if (defaultValue) quill.root.innerHTML = defaultValue;

      quill.on(Quill.events.TEXT_CHANGE, () => {
        onTextChangeRef.current?.(quill.root.innerHTML);
      });

      return () => {
        if (ref) {
          typeof ref === 'function' ? ref(null) : (ref.current = null);
        }
        container.innerHTML = '';
      };
    }, [ref, placeholder, defaultValue]);

    return (
      <div className="min-h-[400px]">
        <div ref={containerRef}></div>
      </div>
    );
  }
);

QuillEditor.displayName = 'QuillEditor';

// Main BlogForm Component
interface BlogFormProps {
  initialData?: Partial<Blog>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  categories,
  tags,
}: BlogFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags?.map((t) => t.id.toString()) || []
  );
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const uploadFileMutation = useUploadFile();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      featured_image: initialData?.image || null,
      image_caption: initialData?.image_caption || "",
      content: initialData?.content || "",
      excerpt: initialData?.teaser || "",
      read_time: initialData?.min_read || 5,
      status: (initialData?.status as "draft" | "published" | "archived") || "draft",
      category_id: initialData?.category?.id?.toString() || null,
      tag_ids: initialData?.tags?.map((t) => t.id.toString()) || [],
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!initialData) form.setValue("slug", generateSlug(title));
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

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
    form.setValue("tag_ids", newTags);
  };

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id.toString()));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul *</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={handleTitleChange} placeholder="Masukkan judul blog" />
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
                      <Input {...field} placeholder="judul-blog-anda" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category and Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      value={field.value || "none"}
                      onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Tidak ada</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
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
                name="read_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Baca (menit) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={1} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedTags.length > 0 ? `${selectedTags.length} tag dipilih` : "Pilih tags..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari tag..." />
                    <CommandList>
                      <CommandEmpty>Tidak ada tag ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {tags.map((tag) => (
                          <CommandItem 
                            key={tag.id} 
                            value={tag.name} 
                            onSelect={() => handleTagToggle(tag.id.toString())}
                          >
                            <Check 
                              className={cn(
                                "mr-2 h-4 w-4", 
                                selectedTags.includes(tag.id.toString()) ? "opacity-100" : "opacity-0"
                              )} 
                            />
                            {tag.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedTagObjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTagObjects.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="gap-1">
                      {tag.name}
                      <button 
                        type="button" 
                        onClick={() => handleTagToggle(tag.id.toString())} 
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOG_STATUS_OPTIONS.filter(opt => opt.value !== "scheduled").map((opt) => (
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

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Cover</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
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
                    className="flex flex-col items-center justify-center cursor-pointer py-8" 
                    onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isUploadingImage ? "Mengupload..." : "Klik untuk upload gambar cover"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (max 5MB)</p>
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
            </div>

            <FormField
              control={form.control}
              name="image_caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption Gambar</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Deskripsi gambar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt / Ringkasan</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} placeholder="Ringkasan singkat yang akan ditampilkan di listing" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten *</FormLabel>
                  <FormControl>
                    <QuillEditor
                      ref={quillRef}
                      defaultValue={field.value}
                      onTextChange={field.onChange}
                      placeholder="Tulis konten blog Anda di sini..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading || isUploadingImage}>
            {isLoading ? "Menyimpan..." : initialData ? "Perbarui" : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}