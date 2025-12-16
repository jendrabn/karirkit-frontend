import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormError } from "@/components/ui/form-error";
import { PhotoUpload } from "./PhotoUpload";
import { TemplateSelector } from "@/components/ui/template-selector";
import { cvTemplates } from "@/data/documentTemplates";
import {
  CV,
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
} from "@/types/cv";

const educationSchema = z.object({
  degree: z.string().min(1, "Jenjang wajib dipilih"),
  school_name: z.string().min(1, "Nama sekolah/universitas wajib diisi"),
  school_location: z.string().min(1, "Lokasi wajib diisi"),
  major: z.string().optional(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12),
  end_year: z.number().min(0).max(2100),
  is_current: z.boolean(),
  gpa: z.number().min(0).max(4).optional(),
  description: z.string().optional(),
});

const certificateSchema = z.object({
  title: z.string().min(1, "Judul sertifikat wajib diisi"),
  issuer: z.string().min(1, "Penerbit wajib diisi"),
  issue_month: z.number().min(1).max(12),
  issue_year: z.number().min(1900).max(2100),
  expiry_month: z.number().min(0).max(12),
  expiry_year: z.number().min(0).max(2100),
  no_expiry: z.boolean(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  job_title: z.string().min(1, "Jabatan wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_location: z.string().min(1, "Lokasi wajib diisi"),
  job_type: z.string().min(1, "Tipe pekerjaan wajib dipilih"),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12),
  end_year: z.number().min(0).max(2100),
  is_current: z.boolean(),
  description: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1, "Nama keahlian wajib diisi"),
  level: z.string().min(1, "Level wajib dipilih"),
});

const awardSchema = z.object({
  title: z.string().min(1, "Judul penghargaan wajib diisi"),
  issuer: z.string().min(1, "Pemberi penghargaan wajib diisi"),
  description: z.string().optional(),
  year: z.number().min(1900).max(2100),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform wajib diisi"),
  url: z.string().url("URL tidak valid"),
});

const organizationSchema = z.object({
  organization_name: z.string().min(1, "Nama organisasi wajib diisi"),
  role_title: z.string().min(1, "Jabatan wajib diisi"),
  organization_type: z.string().min(1, "Tipe organisasi wajib dipilih"),
  location: z.string().optional(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12),
  end_year: z.number().min(0).max(2100),
  is_current: z.boolean(),
  description: z.string().optional(),
});

const cvSchema = z.object({
  template_id: z.string().optional(),
  name: z.string().min(1, "Nama wajib diisi"),
  headline: z.string().min(1, "Headline wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  about: z.string().optional(),
  photo: z.string().optional(),
  educations: z.array(educationSchema),
  certificates: z.array(certificateSchema),
  experiences: z.array(experienceSchema),
  skills: z.array(skillSchema),
  awards: z.array(awardSchema),
  social_links: z.array(socialLinkSchema),
  organizations: z.array(organizationSchema),
});

export type CVFormData = z.infer<typeof cvSchema>;

interface CVFormProps {
  initialData?: Partial<CV>;
  onSubmit: (data: CVFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

export function CVForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CVFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.template_id || cvTemplates[0]?.id || "");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      template_id: initialData?.template_id || cvTemplates[0]?.id || "",
      name: initialData?.name || "",
      headline: initialData?.headline || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      about: initialData?.about || "",
      photo: initialData?.photo || "",
      educations: initialData?.educations || [],
      certificates: initialData?.certificates || [],
      experiences: initialData?.experiences || [],
      skills: initialData?.skills || [],
      awards: initialData?.awards || [],
      social_links: initialData?.social_links || [],
      organizations: initialData?.organizations || [],
    },
  });

  const educations = useFieldArray({ control, name: "educations" });
  const certificates = useFieldArray({ control, name: "certificates" });
  const experiences = useFieldArray({ control, name: "experiences" });
  const skills = useFieldArray({ control, name: "skills" });
  const awards = useFieldArray({ control, name: "awards" });
  const socialLinks = useFieldArray({ control, name: "social_links" });
  const organizations = useFieldArray({ control, name: "organizations" });

  const photoValue = watch("photo");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Template Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Template CV</h3>
        <TemplateSelector
          label="Pilih Template"
          templates={cvTemplates}
          value={selectedTemplate}
          onChange={(value) => {
            setSelectedTemplate(value);
            setValue("template_id", value);
          }}
        />
      </Card>

      {/* Personal Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <PhotoUpload
              value={photoValue || ""}
              onChange={(value) => setValue("photo", value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              {...register("name")}
              className={cn(errors.name && "border-destructive")}
            />
            <FormError message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Headline *</Label>
            <Input
              id="headline"
              {...register("headline")}
              placeholder="Software Engineer | Full Stack Developer"
              className={cn(errors.headline && "border-destructive")}
            />
            <FormError message={errors.headline?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={cn(errors.email && "border-destructive")}
            />
            <FormError message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon *</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="081234567890"
              className={cn(errors.phone && "border-destructive")}
            />
            <FormError message={errors.phone?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Alamat *</Label>
            <Input
              id="address"
              {...register("address")}
              className={cn(errors.address && "border-destructive")}
            />
            <FormError message={errors.address?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="about">Tentang Saya</Label>
            <Textarea
              id="about"
              {...register("about")}
              rows={4}
              placeholder="Ceritakan tentang diri Anda..."
            />
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pendidikan</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => educations.append({
              degree: "bachelor",
              school_name: "",
              school_location: "",
              major: "",
              start_month: 1,
              start_year: currentYear,
              end_month: 0,
              end_year: 0,
              is_current: false,
              gpa: 0,
              description: "",
            })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {educations.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data pendidikan</p>
        ) : (
          <div className="space-y-4">
            {educations.fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Pendidikan #{index + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => educations.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jenjang *</Label>
                    <Select
                      value={watch(`educations.${index}.degree`)}
                      onValueChange={(v) => setValue(`educations.${index}.degree`, v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="z-50">
                        {DEGREE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Sekolah/Universitas *</Label>
                    <Input {...register(`educations.${index}.school_name`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi *</Label>
                    <Input {...register(`educations.${index}.school_location`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Jurusan</Label>
                    <Input {...register(`educations.${index}.major`)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Mulai</Label>
                      <Select
                        value={String(watch(`educations.${index}.start_month`))}
                        onValueChange={(v) => setValue(`educations.${index}.start_month`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Mulai</Label>
                      <Select
                        value={String(watch(`educations.${index}.start_year`))}
                        onValueChange={(v) => setValue(`educations.${index}.start_year`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Selesai</Label>
                      <Select
                        value={String(watch(`educations.${index}.end_month`))}
                        onValueChange={(v) => setValue(`educations.${index}.end_month`, parseInt(v))}
                        disabled={watch(`educations.${index}.is_current`)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="0">-</SelectItem>
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Selesai</Label>
                      <Select
                        value={String(watch(`educations.${index}.end_year`))}
                        onValueChange={(v) => setValue(`educations.${index}.end_year`, parseInt(v))}
                        disabled={watch(`educations.${index}.is_current`)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          <SelectItem value="0">-</SelectItem>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`edu-current-${index}`}
                      checked={watch(`educations.${index}.is_current`)}
                      onCheckedChange={(v) => setValue(`educations.${index}.is_current`, !!v)}
                    />
                    <Label htmlFor={`edu-current-${index}`}>Masih berlangsung</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>IPK</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      {...register(`educations.${index}.gpa`, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Deskripsi</Label>
                    <Textarea {...register(`educations.${index}.description`)} rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pengalaman Kerja</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => experiences.append({
              job_title: "",
              company_name: "",
              company_location: "",
              job_type: "full_time",
              start_month: 1,
              start_year: currentYear,
              end_month: 0,
              end_year: 0,
              is_current: false,
              description: "",
            })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {experiences.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data pengalaman</p>
        ) : (
          <div className="space-y-4">
            {experiences.fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Pengalaman #{index + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => experiences.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jabatan *</Label>
                    <Input {...register(`experiences.${index}.job_title`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Perusahaan *</Label>
                    <Input {...register(`experiences.${index}.company_name`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi *</Label>
                    <Input {...register(`experiences.${index}.company_location`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipe Pekerjaan *</Label>
                    <Select
                      value={watch(`experiences.${index}.job_type`)}
                      onValueChange={(v) => setValue(`experiences.${index}.job_type`, v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="z-50">
                        {JOB_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Mulai</Label>
                      <Select
                        value={String(watch(`experiences.${index}.start_month`))}
                        onValueChange={(v) => setValue(`experiences.${index}.start_month`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Mulai</Label>
                      <Select
                        value={String(watch(`experiences.${index}.start_year`))}
                        onValueChange={(v) => setValue(`experiences.${index}.start_year`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Selesai</Label>
                      <Select
                        value={String(watch(`experiences.${index}.end_month`))}
                        onValueChange={(v) => setValue(`experiences.${index}.end_month`, parseInt(v))}
                        disabled={watch(`experiences.${index}.is_current`)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="0">-</SelectItem>
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Selesai</Label>
                      <Select
                        value={String(watch(`experiences.${index}.end_year`))}
                        onValueChange={(v) => setValue(`experiences.${index}.end_year`, parseInt(v))}
                        disabled={watch(`experiences.${index}.is_current`)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          <SelectItem value="0">-</SelectItem>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-current-${index}`}
                      checked={watch(`experiences.${index}.is_current`)}
                      onCheckedChange={(v) => setValue(`experiences.${index}.is_current`, !!v)}
                    />
                    <Label htmlFor={`exp-current-${index}`}>Masih bekerja</Label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Deskripsi</Label>
                    <Textarea {...register(`experiences.${index}.description`)} rows={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Keahlian</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => skills.append({ name: "", level: "intermediate" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {skills.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data keahlian</p>
        ) : (
          <div className="space-y-3">
            {skills.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Nama Keahlian" {...register(`skills.${index}.name`)} />
                </div>
                <div className="w-40 space-y-2">
                  <Select
                    value={watch(`skills.${index}.level`)}
                    onValueChange={(v) => setValue(`skills.${index}.level`, v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-50">
                      {SKILL_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => skills.remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Certificates */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sertifikasi</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => certificates.append({
              title: "",
              issuer: "",
              issue_month: 1,
              issue_year: currentYear,
              expiry_month: 0,
              expiry_year: 0,
              no_expiry: true,
              credential_id: "",
              credential_url: "",
              description: "",
            })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {certificates.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data sertifikasi</p>
        ) : (
          <div className="space-y-4">
            {certificates.fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Sertifikat #{index + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => certificates.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Judul *</Label>
                    <Input {...register(`certificates.${index}.title`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Penerbit *</Label>
                    <Input {...register(`certificates.${index}.issuer`)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Terbit</Label>
                      <Select
                        value={String(watch(`certificates.${index}.issue_month`))}
                        onValueChange={(v) => setValue(`certificates.${index}.issue_month`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Terbit</Label>
                      <Select
                        value={String(watch(`certificates.${index}.issue_year`))}
                        onValueChange={(v) => setValue(`certificates.${index}.issue_year`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-no-expiry-${index}`}
                      checked={watch(`certificates.${index}.no_expiry`)}
                      onCheckedChange={(v) => setValue(`certificates.${index}.no_expiry`, !!v)}
                    />
                    <Label htmlFor={`cert-no-expiry-${index}`}>Tidak ada masa berlaku</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>ID Kredensial</Label>
                    <Input {...register(`certificates.${index}.credential_id`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Kredensial</Label>
                    <Input {...register(`certificates.${index}.credential_url`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Awards */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Penghargaan</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => awards.append({ title: "", issuer: "", description: "", year: currentYear })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {awards.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data penghargaan</p>
        ) : (
          <div className="space-y-4">
            {awards.fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Penghargaan #{index + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => awards.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Judul *</Label>
                    <Input {...register(`awards.${index}.title`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pemberi *</Label>
                    <Input {...register(`awards.${index}.issuer`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tahun</Label>
                    <Select
                      value={String(watch(`awards.${index}.year`))}
                      onValueChange={(v) => setValue(`awards.${index}.year`, parseInt(v))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="z-50 max-h-48">
                        {yearOptions.map((y) => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>Deskripsi</Label>
                    <Input {...register(`awards.${index}.description`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Organizations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Organisasi</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => organizations.append({
              organization_name: "",
              role_title: "",
              organization_type: "community",
              location: "",
              start_month: 1,
              start_year: currentYear,
              end_month: 0,
              end_year: 0,
              is_current: false,
              description: "",
            })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {organizations.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data organisasi</p>
        ) : (
          <div className="space-y-4">
            {organizations.fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Organisasi #{index + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => organizations.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Organisasi *</Label>
                    <Input {...register(`organizations.${index}.organization_name`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Jabatan *</Label>
                    <Input {...register(`organizations.${index}.role_title`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipe Organisasi *</Label>
                    <Select
                      value={watch(`organizations.${index}.organization_type`)}
                      onValueChange={(v) => setValue(`organizations.${index}.organization_type`, v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="z-50">
                        {ORGANIZATION_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi</Label>
                    <Input {...register(`organizations.${index}.location`)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Mulai</Label>
                      <Select
                        value={String(watch(`organizations.${index}.start_month`))}
                        onValueChange={(v) => setValue(`organizations.${index}.start_month`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Mulai</Label>
                      <Select
                        value={String(watch(`organizations.${index}.start_year`))}
                        onValueChange={(v) => setValue(`organizations.${index}.start_year`, parseInt(v))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Bulan Selesai</Label>
                      <Select
                        value={String(watch(`organizations.${index}.end_month`))}
                        onValueChange={(v) => setValue(`organizations.${index}.end_month`, parseInt(v))}
                        disabled={watch(`organizations.${index}.is_current`)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="0">-</SelectItem>
                          {MONTH_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tahun Selesai</Label>
                      <Select
                        value={String(watch(`organizations.${index}.end_year`))}
                        onValueChange={(v) => setValue(`organizations.${index}.end_year`, parseInt(v))}
                        disabled={watch(`organizations.${index}.is_current`)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 max-h-48">
                          <SelectItem value="0">-</SelectItem>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`org-current-${index}`}
                      checked={watch(`organizations.${index}.is_current`)}
                      onCheckedChange={(v) => setValue(`organizations.${index}.is_current`, !!v)}
                    />
                    <Label htmlFor={`org-current-${index}`}>Masih aktif</Label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Deskripsi</Label>
                    <Textarea {...register(`organizations.${index}.description`)} rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Media Sosial</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => socialLinks.append({ platform: "", url: "" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
        </div>

        {socialLinks.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada data media sosial</p>
        ) : (
          <div className="space-y-3">
            {socialLinks.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="w-40 space-y-2">
                  <Input placeholder="Platform" {...register(`social_links.${index}.platform`)} />
                </div>
                <div className="flex-1 space-y-2">
                  <Input placeholder="URL" {...register(`social_links.${index}.url`)} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => socialLinks.remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
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
