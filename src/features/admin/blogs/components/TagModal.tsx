import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { BlogTag } from "@/types/blog";
import { useEffect } from "react";
import { useFormErrors } from "@/hooks/use-form-errors";

const tagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: BlogTag | null;
  onSubmit: (data: TagFormData) => void;
  isLoading?: boolean;
}

export function TagModal({
  open,
  onOpenChange,
  tag,
  onSubmit,
  isLoading,
}: TagModalProps) {
  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useFormErrors(form);

  useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
        slug: tag.slug,
      });
    } else {
      form.reset({
        name: "",
        slug: "",
      });
    }
  }, [tag, form, open]);

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
    if (!tag) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const handleSubmit = (data: TagFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{tag ? "Edit Tag" : "Tambah Tag"}</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <Field>
              <FieldLabel>Nama Tag *</FieldLabel>
              <Input
                {...form.register("name", {
                  onChange: handleNameChange,
                })}
                placeholder="Masukkan nama tag"
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Slug *</FieldLabel>
              <Input {...form.register("slug")} placeholder="nama-tag" />
              <FieldError>{form.formState.errors.slug?.message}</FieldError>
            </Field>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : tag ? "Perbarui" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
