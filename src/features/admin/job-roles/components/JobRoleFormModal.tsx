import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { type JobRole } from "@/types/job";
import { useEffect } from "react";
import {
  jobRoleSchema,
  type JobRoleFormData as RoleInput,
} from "../api/create-job-role";
import { cn } from "@/lib/utils";

interface JobRoleFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: JobRole | null;
  onSubmit: (data: RoleInput) => void;
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

  const form = useForm<RoleInput>({
    resolver: zodResolver(jobRoleSchema),
    defaultValues: {
      name: editingRole?.name || "",
    },
  });

  // Reset form when editingRole changes or modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: editingRole?.name || "",
      });
    }
  }, [editingRole, isOpen, form]);

  const handleSubmit = (data: RoleInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form id="job-role-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role Pekerjaan" : "Tambah Role Pekerjaan"}
            </DialogTitle>
            <DialogDescription>
              Lengkapi formulir berikut untuk{" "}
              {editingRole ? "mengubah" : "menambahkan"} role pekerjaan
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4 py-4">
            <FieldSet disabled={isLoading} className="space-y-4">
              <Field>
                <FieldLabel>
                  Nama Role <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Contoh: Frontend Developer"
                  {...form.register("name")}
                  className={cn(
                    form.formState.errors.name && "border-destructive",
                  )}
                  form="job-role-form"
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
              {/* Removed the slug field */}
            </FieldSet>
          </div>

          <DialogFooter>
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
            <Button type="submit" form="job-role-form" disabled={isLoading}>
              {isLoading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
