import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { EMPLOYEE_SIZE_LABELS } from "@/types/company";
import {
  createCompanyInputSchema,
  type CreateCompanyInput,
} from "../api/create-company";
import {
  updateCompanyInputSchema,
  type UpdateCompanyInput,
} from "../api/update-company";
import { type Company } from "@/types/company";
import { useEffect } from "react";

interface CompanyFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCompany: Company | null;
  onSubmit: (data: CreateCompanyInput | UpdateCompanyInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CompanyFormModal({
  isOpen,
  onOpenChange,
  editingCompany,
  onSubmit,
  onCancel,
  isLoading,
}: CompanyFormModalProps) {
  const isEdit = !!editingCompany;

  const form = useForm<CreateCompanyInput | UpdateCompanyInput>({
    resolver: zodResolver(
      isEdit ? updateCompanyInputSchema : createCompanyInputSchema
    ),
    defaultValues: {
      name: editingCompany?.name || "",
      description: editingCompany?.description || "",
      logo: editingCompany?.logo || "",
      employee_size: editingCompany?.employee_size || "one_to_ten",
      business_sector: editingCompany?.business_sector || "",
      website_url: editingCompany?.website_url || "",
    },
  });

  // Reset form when editingCompany changes or modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: editingCompany?.name || "",
        description: editingCompany?.description || "",
        logo: editingCompany?.logo || "",
        employee_size: editingCompany?.employee_size || "one_to_ten",
        business_sector: editingCompany?.business_sector || "",
        website_url: editingCompany?.website_url || "",
      });
    }
  }, [editingCompany, isOpen, form]);

  const handleSubmit = (data: CreateCompanyInput | UpdateCompanyInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col max-h-[85vh]"
        >
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>
              {editingCompany ? "Edit Perusahaan" : "Tambah Perusahaan"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet disabled={isLoading}>
              <Field>
                <FieldLabel>Nama Perusahaan *</FieldLabel>
                <Input
                  placeholder="Nama perusahaan"
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Sektor Bisnis *</FieldLabel>
                <Input
                  placeholder="Contoh: Teknologi, Retail"
                  {...form.register("business_sector")}
                />
                <FieldError>
                  {form.formState.errors.business_sector?.message}
                </FieldError>
              </Field>

              <Controller
                control={form.control}
                name="employee_size"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Ukuran Perusahaan *</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {Object.entries(EMPLOYEE_SIZE_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.employee_size?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Website URL</FieldLabel>
                <Input
                  placeholder="https://..."
                  {...form.register("website_url")}
                />
                <FieldError>
                  {form.formState.errors.website_url?.message}
                </FieldError>
              </Field>

              <Controller
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Logo</FieldLabel>
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      label="Logo"
                    />
                    <FieldError>
                      {form.formState.errors.logo?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Deskripsi *</FieldLabel>
                <Textarea
                  placeholder="Deskripsi perusahaan..."
                  {...form.register("description")}
                />
                <FieldError>
                  {form.formState.errors.description?.message}
                </FieldError>
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
                : "Tambah Perusahaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
