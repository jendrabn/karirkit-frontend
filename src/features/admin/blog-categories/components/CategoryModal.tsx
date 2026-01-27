import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import type { BlogCategory } from "../api/get-blog-categories";
import { useEffect } from "react";
import { useServerValidation } from "@/hooks/use-server-validation";
import {
  categorySchema,
  type CategoryFormData,
} from "../api/create-blog-category";
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: BlogCategory | null;
  onSubmit: (data: CategoryFormData) => void;
  error?: unknown;
  isLoading?: boolean;
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
  error,
  isLoading,
}: CategoryModalProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useServerValidation(error, form);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [category, form, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
  };

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col max-h-[85vh]"
        >
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              {category ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet>
              <Field>
                <FieldLabel>
                  Nama Kategori <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...form.register("name", {
                    onChange: handleNameChange,
                  })}
                  placeholder="Masukkan nama kategori"
                  className={cn(
                    form.formState.errors.name && "border-destructive",
                  )}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Deskripsi <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  {...form.register("description")}
                  placeholder="Masukkan deskripsi kategori"
                  rows={3}
                  className={cn(
                    form.formState.errors.description && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.description?.message}
                </FieldError>
              </Field>
            </FieldSet>
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
