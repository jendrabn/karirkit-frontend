import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { BlogCategory } from "@/features/admin/blogs/api/get-blog-categories";
import { useEffect } from "react";
import { useFormErrors } from "@/hooks/use-form-errors";

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: BlogCategory | null;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: CategoryModalProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  useFormErrors(form);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
      });
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [category, form, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!category) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>
              {category ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <Field>
              <FieldLabel>Nama Kategori *</FieldLabel>
              <Input
                {...form.register("name", {
                  onChange: handleNameChange,
                })}
                placeholder="Masukkan nama kategori"
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Slug *</FieldLabel>
              <Input {...form.register("slug")} placeholder="nama-kategori" />
              <FieldError>{form.formState.errors.slug?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Deskripsi *</FieldLabel>
              <Textarea
                {...form.register("description")}
                placeholder="Masukkan deskripsi kategori"
                rows={3}
              />
              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : category ? "Perbarui" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
