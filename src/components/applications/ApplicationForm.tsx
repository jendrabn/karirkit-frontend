import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FormError } from "@/components/ui/form-error";
import {
  Application,
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";

const applicationSchema = z.object({
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_url: z.string().url("URL tidak valid").or(z.literal("")),
  position: z.string().min(1, "Posisi wajib diisi"),
  job_source: z.string().min(1, "Sumber lowongan wajib diisi"),
  job_type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]),
  work_system: z.enum(["onsite", "remote", "hybrid"]),
  salary_min: z.number().min(0, "Gaji minimal harus 0 atau lebih"),
  salary_max: z.number().min(0, "Gaji maksimal harus 0 atau lebih"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  status: z.enum([
    "draft", "submitted", "administration_screening", "hr_screening",
    "online_test", "psychology_test", "technical_test", "hr_test",
    "user_interview", "final_interview", "offering", "mcu", "onboarding",
    "rejected", "accepted"
  ]),
  result_status: z.enum(["pending", "passed", "failed"]),
  contact_name: z.string().optional(),
  contact_email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  contact_phone: z.string().optional(),
  follow_up_date: z.string().optional(),
  follow_up_note: z.string().optional(),
  job_url: z.string().url("URL tidak valid").or(z.literal("")).optional(),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  initialData?: Partial<Application>;
  onSubmit: (data: ApplicationFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: initialData?.company_name || "",
      company_url: initialData?.company_url || "",
      position: initialData?.position || "",
      job_source: initialData?.job_source || "",
      job_type: initialData?.job_type || "full_time",
      work_system: initialData?.work_system || "onsite",
      salary_min: initialData?.salary_min || 0,
      salary_max: initialData?.salary_max || 0,
      location: initialData?.location || "",
      date: initialData?.date || "",
      status: initialData?.status || "draft",
      result_status: initialData?.result_status || "pending",
      contact_name: initialData?.contact_name || "",
      contact_email: initialData?.contact_email || "",
      contact_phone: initialData?.contact_phone || "",
      follow_up_date: initialData?.follow_up_date || "",
      follow_up_note: initialData?.follow_up_note || "",
      job_url: initialData?.job_url || "",
      notes: initialData?.notes || "",
    },
  });

  const dateValue = watch("date");
  const followUpDateValue = watch("follow_up_date");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informasi Perusahaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Nama Perusahaan *</Label>
            <Input
              id="company_name"
              {...register("company_name")}
              className={cn(errors.company_name && "border-destructive")}
            />
            <FormError message={errors.company_name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_url">URL Perusahaan</Label>
            <Input
              id="company_url"
              {...register("company_url")}
              placeholder="https://..."
              className={cn(errors.company_url && "border-destructive")}
            />
            <FormError message={errors.company_url?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Posisi *</Label>
            <Input
              id="position"
              {...register("position")}
              className={cn(errors.position && "border-destructive")}
            />
            <FormError message={errors.position?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_source">Sumber Lowongan *</Label>
            <Input
              id="job_source"
              {...register("job_source")}
              placeholder="LinkedIn, Jobstreet, dll"
              className={cn(errors.job_source && "border-destructive")}
            />
            <FormError message={errors.job_source?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_url">URL Lowongan</Label>
            <Input
              id="job_url"
              {...register("job_url")}
              placeholder="https://..."
              className={cn(errors.job_url && "border-destructive")}
            />
            <FormError message={errors.job_url?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi *</Label>
            <Input
              id="location"
              {...register("location")}
              className={cn(errors.location && "border-destructive")}
            />
            <FormError message={errors.location?.message} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detail Pekerjaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipe Pekerjaan *</Label>
            <Select
              value={watch("job_type")}
              onValueChange={(value) => setValue("job_type", value as any)}
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
          </div>

          <div className="space-y-2">
            <Label>Sistem Kerja *</Label>
            <Select
              value={watch("work_system")}
              onValueChange={(value) => setValue("work_system", value as any)}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary_min">Gaji Minimal</Label>
            <Input
              id="salary_min"
              type="number"
              {...register("salary_min", { valueAsNumber: true })}
              className={cn(errors.salary_min && "border-destructive")}
            />
            <FormError message={errors.salary_min?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary_max">Gaji Maksimal</Label>
            <Input
              id="salary_max"
              type="number"
              {...register("salary_max", { valueAsNumber: true })}
              className={cn(errors.salary_max && "border-destructive")}
            />
            <FormError message={errors.salary_max?.message} />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Lamaran *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateValue && "text-muted-foreground",
                    errors.date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue ? format(new Date(dateValue), "dd/MM/yyyy") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue ? new Date(dateValue) : undefined}
                  onSelect={(date) => setValue("date", date ? format(date, "yyyy-MM-dd") : "")}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormError message={errors.date?.message} />
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as any)}
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
          </div>

          <div className="space-y-2">
            <Label>Hasil *</Label>
            <Select
              value={watch("result_status")}
              onValueChange={(value) => setValue("result_status", value as any)}
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
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_name">Nama Kontak</Label>
            <Input id="contact_name" {...register("contact_name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Kontak</Label>
            <Input
              id="contact_email"
              type="email"
              {...register("contact_email")}
              className={cn(errors.contact_email && "border-destructive")}
            />
            <FormError message={errors.contact_email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telepon Kontak</Label>
            <Input id="contact_phone" {...register("contact_phone")} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Follow Up</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tanggal Follow Up</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !followUpDateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {followUpDateValue ? format(new Date(followUpDateValue), "dd/MM/yyyy") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={followUpDateValue ? new Date(followUpDateValue) : undefined}
                  onSelect={(date) => setValue("follow_up_date", date ? format(date, "yyyy-MM-dd") : "")}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="follow_up_note">Catatan Follow Up</Label>
            <Textarea id="follow_up_note" {...register("follow_up_note")} rows={3} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Catatan</h3>
        <div className="space-y-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" {...register("notes")} rows={4} />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
