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
import { type JobRole } from "@/types/job";
import { useEffect } from "react";
import {
  jobRoleSchema,
  type JobRoleFormData as RoleInput,
} from "../api/create-job-role";

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
      <DialogContent className="max-w-md p-0 gap-0">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col max-h-[85vh]"
        >
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              {editingRole ? "Edit Role Pekerjaan" : "Tambah Role Pekerjaan"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet disabled={isLoading} className="space-y-4">
              <Field>
                <FieldLabel>Nama Role *</FieldLabel>
                <Input
                  placeholder="Contoh: Frontend Developer"
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
              {/* Removed the slug field */}
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
