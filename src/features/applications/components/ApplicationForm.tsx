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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
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
import { useFormErrors } from "@/hooks/use-form-errors";

interface ApplicationFormProps {
  initialData?: UpdateApplicationInput;
  onSubmit: (data: CreateApplicationInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ApplicationFormProps) {
  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationInputSchema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          // Ensure specific optional fields are strings if they are undefined in initialData
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
          job_type: "full_time",
          work_system: "onsite",
          salary_min: 0,
          salary_max: 0,
          location: "",
          date: dayjs().format("YYYY-MM-DD"), // Default to today
          status: "draft",
          result_status: "pending",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          follow_up_date: null,
          follow_up_note: "",
          job_url: "",
          notes: "",
        },
  });

  // Handle form validation errors from API
  useFormErrors(form);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet disabled={isLoading} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informasi Perusahaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Nama Perusahaan *</FieldLabel>
                <Input {...form.register("company_name")} />
                <FieldError>
                  {form.formState.errors.company_name?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>URL Perusahaan</FieldLabel>
                <Input
                  {...form.register("company_url")}
                  placeholder="https://..."
                />
                <FieldError>
                  {form.formState.errors.company_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Posisi *</FieldLabel>
                <Input {...form.register("position")} />
                <FieldError>
                  {form.formState.errors.position?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Sumber Lowongan</FieldLabel>
                <Input
                  {...form.register("job_source")}
                  placeholder="LinkedIn, Jobstreet, dll"
                />
                <FieldError>
                  {form.formState.errors.job_source?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>URL Lowongan</FieldLabel>
                <Input
                  {...form.register("job_url")}
                  placeholder="https://..."
                />
                <FieldError>
                  {form.formState.errors.job_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Lokasi</FieldLabel>
                <Input {...form.register("location")} />
                <FieldError>
                  {form.formState.errors.location?.message}
                </FieldError>
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detail Pekerjaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="job_type"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tipe Pekerjaan</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  {...form.register("salary_min", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                <FieldError>
                  {form.formState.errors.salary_min?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Gaji Maksimal</FieldLabel>
                <Input
                  type="number"
                  {...form.register("salary_max", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
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
                    <FieldLabel>Tanggal Lamaran *</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? dayjs(field.value).format("DD/MM/YYYY")
                            : "Pilih tanggal"}
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
                              date ? dayjs(date).format("YYYY-MM-DD") : ""
                            )
                          }
                          className="pointer-events-auto"
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
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <FieldLabel>Hasil</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Nama Kontak</FieldLabel>
                <Input {...form.register("contact_name")} />
                <FieldError>
                  {form.formState.errors.contact_name?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Email Kontak</FieldLabel>
                <Input type="email" {...form.register("contact_email")} />
                <FieldError>
                  {form.formState.errors.contact_email?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Telepon Kontak</FieldLabel>
                <Input {...form.register("contact_phone")} />
                <FieldError>
                  {form.formState.errors.contact_phone?.message}
                </FieldError>
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Follow Up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? dayjs(field.value).format("DD/MM/YYYY")
                            : "Pilih tanggal"}
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
                              date ? dayjs(date).format("YYYY-MM-DD") : null
                            )
                          }
                          className="pointer-events-auto"
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
                <Textarea {...form.register("follow_up_note")} rows={3} />
                <FieldError>
                  {form.formState.errors.follow_up_note?.message}
                </FieldError>
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Catatan</h3>
            <Field>
              <FieldLabel>Catatan</FieldLabel>
              <Textarea {...form.register("notes")} rows={4} />
              <FieldError>{form.formState.errors.notes?.message}</FieldError>
            </Field>
          </Card>
        </FieldSet>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
