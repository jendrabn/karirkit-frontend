import { useForm, Controller } from "react-hook-form";
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
import { cn } from "@/lib/utils";

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
      isEdit ? updateCompanyInputSchema : createCompanyInputSchema,
    ),
    defaultValues: {
      name: editingCompany?.name || "",
      description: editingCompany?.description || "",
      logo: editingCompany?.logo || "",
      employee_size: editingCompany?.employee_size ?? undefined,
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
        employee_size: editingCompany?.employee_size ?? undefined,
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
      <form id="company-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent className="!max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Edit Perusahaan" : "Tambah Perusahaan"}
            </DialogTitle>
            <DialogDescription>
              {editingCompany
                ? "Edit informasi perusahaan pada formulir berikut. Klik simpan ketika selesai."
                : "Tambahkan informasi perusahaan baru pada formulir berikut. Klik simpan ketika selesai."}
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[65vh] overflow-y-auto px-4">
            <FieldSet disabled={isLoading}>
              <Field>
                <FieldLabel>
                  Nama Perusahaan <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Nama perusahaan"
                  {...form.register("name")}
                  className={cn(
                    form.formState.errors.name && "border-destructive",
                  )}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Sektor Bisnis</FieldLabel>
                <Input
                  placeholder="Contoh: Teknologi, Retail"
                  {...form.register("business_sector")}
                  className={cn(
                    form.formState.errors.business_sector &&
                      "border-destructive",
                  )}
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
                    <FieldLabel>Ukuran Perusahaan</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.employee_size &&
                            "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Ukuran Perusahaan" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {Object.entries(EMPLOYEE_SIZE_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
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
                  className={cn(
                    form.formState.errors.website_url && "border-destructive",
                  )}
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
                <FieldLabel>Deskripsi</FieldLabel>
                <Textarea
                  placeholder="Deskripsi perusahaan..."
                  {...form.register("description")}
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
            <Button type="submit" disabled={isLoading} form="company-form">
              {isLoading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Perusahaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
