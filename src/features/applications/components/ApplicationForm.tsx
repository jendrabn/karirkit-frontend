import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dayjs } from "@/lib/date";
import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";
import {
  type CreateApplicationInput,
  createApplicationInputSchema,
} from "../api/create-application";
import type { UpdateApplicationInput } from "../api/update-application";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";

interface ApplicationFormProps {
  initialData?: UpdateApplicationInput;
  onSubmit: (data: CreateApplicationInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: unknown;
}

export function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: ApplicationFormProps) {
  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationInputSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          company_url: initialData.company_url || "",
          job_source: initialData.job_source || "",
          salary_min: initialData.salary_min || 0,
          salary_max: initialData.salary_max || 0,
          contact_name: initialData.contact_name || "",
          contact_email: initialData.contact_email || "",
          contact_phone: initialData.contact_phone || "",
          follow_up_date: initialData.follow_up_date || null,
          follow_up_note: initialData.follow_up_note || "",
          job_url: initialData.job_url || "",
          notes: initialData.notes || "",
        }
      : {
          company_name: "",
          company_url: "",
          position: "",
          job_source: "",
          salary_min: 0,
          salary_max: 0,
          location: "",
          date: dayjs().format("YYYY-MM-DD"), // Default to today
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          follow_up_date: null,
          follow_up_note: "",
          job_url: "",
          notes: "",
        },
  });

  useServerValidation(error, form);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, displayFormErrors)}>
      <FieldSet disabled={isLoading} className="space-y-8 mb-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>
                  Nama Perusahaan <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...form.register("company_name")}
                  placeholder="Contoh: PT Teknologi Nusantara"
                  className={cn(
                    form.formState.errors.company_name && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.company_name?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Website Perusahaan</FieldLabel>
                <Input
                  {...form.register("company_url")}
                  placeholder="https://www.perusahaan.com"
                  className={cn(
                    form.formState.errors.company_url && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.company_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>
                  Posisi Dilamar <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...form.register("position")}
                  placeholder="Contoh: Frontend Developer"
                  className={cn(
                    form.formState.errors.position && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.position?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Sumber Lowongan</FieldLabel>
                <Input
                  {...form.register("job_source")}
                  placeholder="LinkedIn, Jobstreet, Website Perusahaan"
                  className={cn(
                    form.formState.errors.job_source && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.job_source?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>URL Lowongan</FieldLabel>
                <Input
                  {...form.register("job_url")}
                  placeholder="https://jobs.company.com/frontend-developer"
                  className={cn(
                    form.formState.errors.job_url && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.job_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Lokasi</FieldLabel>
                <Input
                  {...form.register("location")}
                  placeholder="Jakarta / Remote / Hybrid"
                  className={cn(
                    form.formState.errors.location && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.location?.message}
                </FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={form.control}
                name="job_type"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tipe Pekerjaan</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.job_type &&
                            "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Tipe Pekerjaan" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {JOB_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.job_type?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="work_system"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Sistem Kerja</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.work_system &&
                            "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Sistem Kerja" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {WORK_SYSTEM_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.work_system?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Gaji Minimal</FieldLabel>
                <Input
                  type="number"
                  placeholder="Contoh: 8000000"
                  {...form.register("salary_min", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  className={cn(
                    form.formState.errors.salary_min && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.salary_min?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Gaji Maksimal</FieldLabel>
                <Input
                  type="number"
                  placeholder="Contoh: 12000000"
                  {...form.register("salary_max", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  className={cn(
                    form.formState.errors.salary_max && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.salary_max?.message}
                </FieldError>
              </Field>

              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Tanggal Lamaran
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? dayjs(field.value).format("DD/MM/YYYY")
                            : "Pilih tanggal lamaran"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? dayjs(field.value).toDate()
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? dayjs(date).format("YYYY-MM-DD") : "",
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError>
                      {form.formState.errors.date?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Status Lamaran</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.status && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Status Lamaran" />
                      </SelectTrigger>
                      <SelectContent className="z-50 max-h-60">
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.status?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="result_status"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Hasil Akhir</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.result_status &&
                            "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Hasil Akhir" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {RESULT_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.result_status?.message}
                    </FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field>
                <FieldLabel>Nama Kontak</FieldLabel>
                <Input
                  placeholder="Nama HR / Recruiter"
                  {...form.register("contact_name")}
                  className={cn(
                    form.formState.errors.contact_name && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.contact_name?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Email Kontak</FieldLabel>
                <Input
                  type="email"
                  placeholder="hr@perusahaan.com"
                  {...form.register("contact_email")}
                  className={cn(
                    form.formState.errors.contact_email && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.contact_email?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Telepon Kontak</FieldLabel>
                <Input
                  placeholder="+62 812 3456 7890"
                  {...form.register("contact_phone")}
                  className={cn(
                    form.formState.errors.contact_phone && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.contact_phone?.message}
                </FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Follow Up */}
        <Card>
          <CardHeader>
            <CardTitle>Follow Up</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tanggal Follow Up</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? dayjs(field.value).format("DD/MM/YYYY")
                            : "Pilih tanggal follow up"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? dayjs(field.value).toDate()
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? dayjs(date).format("YYYY-MM-DD") : null,
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError>
                      {form.formState.errors.follow_up_date?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Field className="md:col-span-2">
                <FieldLabel>Catatan Follow Up</FieldLabel>
                <Textarea
                  rows={3}
                  placeholder="Contoh: Follow up via email, menunggu balasan HR"
                  {...form.register("follow_up_note")}
                />
                <FieldError>
                  {form.formState.errors.follow_up_note?.message}
                </FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Catatan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Field>
              <FieldLabel>Catatan Tambahan</FieldLabel>
              <Textarea
                rows={4}
                placeholder="Catatan pribadi terkait lamaran ini"
                {...form.register("notes")}
              />
              <FieldError>{form.formState.errors.notes?.message}</FieldError>
            </Field>
          </CardContent>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Menyimpan...
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
