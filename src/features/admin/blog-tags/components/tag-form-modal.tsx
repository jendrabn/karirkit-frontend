import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import type { BlogTag } from "../api/get-blog-tags";
import { useEffect } from "react";
import { useServerValidation } from "@/hooks/use-server-validation";
import { tagSchema, type TagFormData } from "../api/create-blog-tag";
import { cn } from "@/lib/utils";

interface TagFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: BlogTag | null;
  onSubmit: (data: TagFormData) => void;
  error?: unknown;
  isLoading?: boolean;
}

export function TagFormModal({
  open,
  onOpenChange,
  tag,
  onSubmit,
  error,
  isLoading,
}: TagFormModalProps) {
  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  useServerValidation(error, form);

  useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [tag, form, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
  };

  const handleSubmit = (data: TagFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={form.handleSubmit(handleSubmit)} id="tag-form">
        <DialogContent className="!max-w-xl">
          <DialogHeader>
            <DialogTitle>{tag ? "Edit Tag" : "Tambah Tag"}</DialogTitle>
            <DialogDescription>
              {tag
                ? "Edit informasi tag pada formulir berikut. Klik simpan ketika selesai."
                : "Tambahkan informasi tag baru pada formulir berikut. Klik simpan ketika selesai."
              }
            </DialogDescription>
          </DialogHeader>

          <FieldSet>
            <Field>
              <FieldLabel>
                Nama Tag <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...form.register("name", {
                  onChange: handleNameChange,
                })}
                placeholder="Masukkan nama tag"
                className={cn(
                  form.formState.errors.name && "border-destructive",
                )}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>
          </FieldSet>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} form="tag-form">
              {isLoading ? "Menyimpan..." : tag ? "Perbarui" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
