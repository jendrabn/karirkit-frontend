import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import {
  createJobRoleInputSchema,
  type CreateJobRoleInput,
} from "../api/create-job-role";
import {
  updateJobRoleInputSchema,
  type UpdateJobRoleInput,
} from "../api/update-job-role";
import { type JobRole } from "@/types/job";
import { useEffect } from "react";

interface JobRoleFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: JobRole | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function JobRoleFormModal({
  isOpen,
  onOpenChange,
  editingRole,
  onSubmit,
  onCancel,
  isLoading,
}: JobRoleFormModalProps) {
  const isEdit = !!editingRole;

  const form = useForm<CreateJobRoleInput | UpdateJobRoleInput>({
    resolver: zodResolver(
      isEdit ? updateJobRoleInputSchema : createJobRoleInputSchema
    ),
    defaultValues: {
      name: editingRole?.name || "",
      slug: editingRole?.slug || "",
    },
  });

  // Reset form when editingRole changes or modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: editingRole?.name || "",
        slug: editingRole?.slug || "",
      });
    }
  }, [editingRole, isOpen, form]);

  const name = form.watch("name");

  useEffect(() => {
    if (!editingRole && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
  }, [name, editingRole, form]);

  const handleSubmit = (data: CreateJobRoleInput | UpdateJobRoleInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>
              {editingRole ? "Edit Role Pekerjaan" : "Tambah Role Pekerjaan"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <FieldSet disabled={isLoading} className="space-y-4">
              <Field>
                <FieldLabel>Nama Role *</FieldLabel>
                <Input
                  placeholder="Contoh: Frontend Developer"
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Slug *</FieldLabel>
                <Input
                  placeholder="frontend-developer"
                  {...form.register("slug")}
                />
                <FieldError>{form.formState.errors.slug?.message}</FieldError>
              </Field>
            </FieldSet>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Tambah Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
