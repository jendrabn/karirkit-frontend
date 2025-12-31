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
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import type { BlogTag } from "../api/get-blog-tags";
import { useEffect } from "react";
import { useFormErrors } from "@/hooks/use-form-errors";

const tagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi"),
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
    },
  });

  useFormErrors(form);

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
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col max-h-[85vh]"
        >
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>{tag ? "Edit Tag" : "Tambah Tag"}</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="space-y-4">
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
            </FieldSet>
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
