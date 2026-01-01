import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  GraduationCap,
  Briefcase,
  Wrench,
  Award,
  Trophy,
  Users,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { PhotoUpload } from "./PhotoUpload";
import { TemplateSelector } from "@/components/ui/template-selector";
import { useTemplates } from "@/features/landing/api/get-templates";
import { buildImageUrl } from "@/lib/utils";
import { useFormErrors } from "@/hooks/use-form-errors";
import {
  type CV,
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/cv";

const educationSchema = z.object({
  degree: z.enum([
    "middle_school",
    "high_school",
    "associate_d1",
    "associate_d2",
    "associate_d3",
    "bachelor",
    "master",
    "doctorate",
    "any",
  ]),
  school_name: z.string().min(1, "Nama sekolah/universitas wajib diisi"),
  school_location: z.string().min(1, "Lokasi wajib diisi"),
  major: z.string().optional(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12).nullable().optional(),
  end_year: z.number().min(0).max(2100).nullable().optional(),
  is_current: z.boolean(),
  gpa: z.number().min(0).max(4).nullable().optional(),
  description: z.string().optional(),
});

const certificateSchema = z.object({
  title: z.string().min(1, "Judul sertifikat wajib diisi"),
  issuer: z.string().min(1, "Penerbit wajib diisi"),
  issue_month: z.number().min(1).max(12),
  issue_year: z.number().min(1900).max(2100),
  expiry_month: z.number().min(0).max(12).nullable().optional(),
  expiry_year: z.number().min(0).max(2100).nullable().optional(),
  no_expiry: z.boolean(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  job_title: z.string().min(1, "Jabatan wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_location: z.string().min(1, "Lokasi wajib diisi"),
  job_type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "freelance",
  ]),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12).nullable().optional(),
  end_year: z.number().min(0).max(2100).nullable().optional(),
  is_current: z.boolean(),
  description: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1, "Nama keahlian wajib diisi"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

const awardSchema = z.object({
  title: z.string().min(1, "Judul penghargaan wajib diisi"),
  issuer: z.string().min(1, "Pemberi penghargaan wajib diisi"),
  description: z.string().optional(),
  year: z.number().min(1900).max(2100).nullable().optional(),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform wajib diisi"),
  url: z.string().url("URL tidak valid"),
});

const organizationSchema = z.object({
  organization_name: z.string().min(1, "Nama organisasi wajib diisi"),
  role_title: z.string().min(1, "Jabatan wajib diisi"),
  organization_type: z.enum([
    "student",
    "professional",
    "volunteer",
    "community",
  ]),
  location: z.string().optional(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(2100),
  end_month: z.number().min(0).max(12).nullable().optional(),
  end_year: z.number().min(0).max(2100).nullable().optional(),
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
  language: z.enum(["en", "id"]).optional(),
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
  const form = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      template_id: initialData?.template_id || "",
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
      language: initialData?.language || "id",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Handle form validation errors from API
  useFormErrors(form);

  const { data: templatesData, isLoading: isTemplatesLoading } = useTemplates({
    params: { type: "cv", language: watch("language") },
  });

  const apiTemplates =
    templatesData?.items.map((t) => ({
      id: t.id,
      name: t.name,
      previewImage: buildImageUrl(t.preview),
    })) || [];

  const [selectedTemplate, setSelectedTemplate] = useState(
    initialData?.template_id || ""
  );

  // Set default template when data is loaded
  if (!selectedTemplate && apiTemplates.length > 0) {
    setSelectedTemplate(apiTemplates[0].id);
  }

  const educations = useFieldArray({ control, name: "educations" });
  const certificates = useFieldArray({ control, name: "certificates" });
  const experiences = useFieldArray({ control, name: "experiences" });
  const skills = useFieldArray({ control, name: "skills" });
  const awards = useFieldArray({ control, name: "awards" });
  const socialLinks = useFieldArray({ control, name: "social_links" });
  const organizations = useFieldArray({ control, name: "organizations" });

  const photoValue = watch("photo");

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("CV Validation Errors:", errors);
      })}
    >
      <FieldSet disabled={isLoading} className="space-y-6 mb-6">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Template CV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Field>
                  <FieldLabel>Bahasa *</FieldLabel>
                  <Select
                    value={watch("language")}
                    onValueChange={(v) =>
                      setValue("language", v as "id" | "en")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {LANGUAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors.language?.message}</FieldError>
                </Field>
              </div>

              <div className="md:col-span-3">
                {isTemplatesLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-sm text-muted-foreground">
                      Memuat templates...
                    </div>
                  </div>
                ) : (
                  <>
                    <TemplateSelector
                      label="Pilih Template"
                      templates={apiTemplates}
                      value={selectedTemplate}
                      onChange={(value) => {
                        setSelectedTemplate(value);
                        setValue("template_id", value);
                        setSelectedTemplate(value);
                      }}
                    />
                    {errors.template_id && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {errors.template_id.message}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <PhotoUpload
                  value={photoValue || ""}
                  onChange={(value) => setValue("photo", value)}
                  quality={75}
                  webp={false}
                  format="jpg,png"
                />
                {errors.photo && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {errors.photo.message}
                  </p>
                )}
              </div>

              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap *</FieldLabel>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Doe"
                  className={cn(errors.name && "border-destructive")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="headline">Headline *</FieldLabel>
                <Input
                  id="headline"
                  {...register("headline")}
                  placeholder="Software Engineer | Full Stack Developer"
                  className={cn(errors.headline && "border-destructive")}
                />
                <FieldError>{errors.headline?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john.doe@example.com"
                  className={cn(errors.email && "border-destructive")}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Nomor Telepon *</FieldLabel>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="081234567890"
                  className={cn(errors.phone && "border-destructive")}
                />
                <FieldError>{errors.phone?.message}</FieldError>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="address">Alamat *</FieldLabel>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Jl. Jend. Sudirman No. 1, Jakarta"
                  className={cn(errors.address && "border-destructive")}
                />
                <FieldError>{errors.address?.message}</FieldError>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="about">Tentang Saya</FieldLabel>
                <Textarea
                  id="about"
                  {...register("about")}
                  rows={4}
                  placeholder="Ceritakan tentang diri Anda..."
                />
                <FieldError>{errors.about?.message}</FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Pendidikan</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                educations.append({
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
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {educations.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data pendidikan</p>
                <p className="text-sm">
                  Tambahkan riwayat pendidikan terakhir Anda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {educations.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        Pendidikan #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => educations.remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>Jenjang *</FieldLabel>
                          <input
                            type="hidden"
                            {...register(`educations.${index}.degree`)}
                          />
                          <Select
                            value={watch(`educations.${index}.degree`)}
                            onValueChange={(v) =>
                              setValue(
                                `educations.${index}.degree`,
                                v as
                                  | "middle_school"
                                  | "high_school"
                                  | "associate_d1"
                                  | "associate_d2"
                                  | "associate_d3"
                                  | "bachelor"
                                  | "master"
                                  | "doctorate"
                                  | "any",
                                { shouldDirty: true, shouldValidate: true }
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {DEGREE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.educations?.[index]?.degree?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Nama Sekolah/Universitas *</FieldLabel>
                          <Input
                            {...register(`educations.${index}.school_name`)}
                            placeholder="Universitas Indonesia"
                            className={cn(
                              errors.educations?.[index]?.school_name &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {errors.educations?.[index]?.school_name?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Lokasi *</FieldLabel>
                          <Input
                            {...register(`educations.${index}.school_location`)}
                            placeholder="Depok, Jawa Barat"
                            className={cn(
                              errors.educations?.[index]?.school_location &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {
                              errors.educations?.[index]?.school_location
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Jurusan</FieldLabel>
                          <Input
                            {...register(`educations.${index}.major`)}
                            placeholder="Teknik Informatika"
                          />
                          <FieldError>
                            {errors.educations?.[index]?.major?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field>
                          <FieldLabel>Bulan Mulai</FieldLabel>
                          <Select
                            value={String(
                              watch(`educations.${index}.start_month`) || 1
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `educations.${index}.start_month`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.educations?.[index]?.start_month?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Mulai</FieldLabel>
                          <Select
                            value={String(
                              watch(`educations.${index}.start_year`) ||
                                currentYear
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `educations.${index}.start_year`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.educations?.[index]?.start_year?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Bulan Selesai</FieldLabel>
                          <Select
                            value={String(
                              watch(`educations.${index}.end_month`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `educations.${index}.end_month`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(`educations.${index}.is_current`)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="0">-</SelectItem>
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.educations?.[index]?.end_month?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Selesai</FieldLabel>
                          <Select
                            value={String(
                              watch(`educations.${index}.end_year`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `educations.${index}.end_year`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(`educations.${index}.is_current`)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              <SelectItem value="0">-</SelectItem>
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.educations?.[index]?.end_year?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <Field
                        orientation="horizontal"
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`edu-current-${index}`}
                          className="rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          checked={watch(`educations.${index}.is_current`)}
                          onCheckedChange={(v) => {
                            setValue(`educations.${index}.is_current`, !!v);
                            if (v) {
                              setValue(`educations.${index}.end_month`, 0);
                              setValue(`educations.${index}.end_year`, 0);
                            }
                          }}
                        />
                        <FieldLabel
                          htmlFor={`edu-current-${index}`}
                          className="font-normal"
                        >
                          Masih berlangsung
                        </FieldLabel>
                      </Field>

                      <Field className="w-full md:w-1/2">
                        <FieldLabel>IPK</FieldLabel>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          placeholder="3.85"
                          {...register(`educations.${index}.gpa`, {
                            valueAsNumber: true,
                          })}
                        />
                        <FieldError>
                          {errors.educations?.[index]?.gpa?.message}
                        </FieldError>
                      </Field>

                      <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <Textarea
                          {...register(`educations.${index}.description`)}
                          rows={2}
                          placeholder="Fokus pada pengembangan perangkat lunak..."
                        />
                        <FieldError>
                          {errors.educations?.[index]?.description?.message}
                        </FieldError>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Pengalaman Kerja</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                experiences.append({
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
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {experiences.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data pengalaman</p>
                <p className="text-sm">
                  Tambahkan pengalaman kerja yang relevan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        Pengalaman #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => experiences.remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>Jabatan *</FieldLabel>
                          <Input
                            {...register(`experiences.${index}.job_title`)}
                            placeholder="Senior Software Engineer"
                            className={cn(
                              errors.experiences?.[index]?.job_title &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {errors.experiences?.[index]?.job_title?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Nama Perusahaan *</FieldLabel>
                          <Input
                            {...register(`experiences.${index}.company_name`)}
                            placeholder="PT Teknologi Maju"
                            className={cn(
                              errors.experiences?.[index]?.company_name &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {errors.experiences?.[index]?.company_name?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Lokasi *</FieldLabel>
                          <Input
                            {...register(
                              `experiences.${index}.company_location`
                            )}
                            placeholder="Jakarta Selatan"
                            className={cn(
                              errors.experiences?.[index]?.company_location &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {
                              errors.experiences?.[index]?.company_location
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tipe Pekerjaan *</FieldLabel>
                          <Select
                            value={watch(`experiences.${index}.job_type`)}
                            onValueChange={(v) =>
                              setValue(
                                `experiences.${index}.job_type`,
                                v as
                                  | "full_time"
                                  | "part_time"
                                  | "contract"
                                  | "internship"
                                  | "freelance"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {JOB_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.experiences?.[index]?.job_type?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field>
                          <FieldLabel>Bulan Mulai</FieldLabel>
                          <Select
                            value={String(
                              watch(`experiences.${index}.start_month`) || 1
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `experiences.${index}.start_month`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.experiences?.[index]?.start_month?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Mulai</FieldLabel>
                          <Select
                            value={String(
                              watch(`experiences.${index}.start_year`) ||
                                currentYear
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `experiences.${index}.start_year`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.experiences?.[index]?.start_year?.message}
                          </FieldError>
                        </Field>

                        <Field>
                          <FieldLabel>Bulan Selesai</FieldLabel>
                          <Select
                            value={String(
                              watch(`experiences.${index}.end_month`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `experiences.${index}.end_month`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(`experiences.${index}.is_current`)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="0">-</SelectItem>
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.experiences?.[index]?.end_month?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Selesai</FieldLabel>
                          <Select
                            value={String(
                              watch(`experiences.${index}.end_year`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `experiences.${index}.end_year`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(`experiences.${index}.is_current`)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              <SelectItem value="0">-</SelectItem>
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.experiences?.[index]?.end_year?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <Field
                        orientation="horizontal"
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`exp-current-${index}`}
                          className="rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          checked={watch(`experiences.${index}.is_current`)}
                          onCheckedChange={(v) => {
                            setValue(`experiences.${index}.is_current`, !!v);
                            if (v) {
                              setValue(`experiences.${index}.end_month`, 0);
                              setValue(`experiences.${index}.end_year`, 0);
                            }
                          }}
                        />
                        <FieldLabel
                          htmlFor={`exp-current-${index}`}
                          className="font-normal"
                        >
                          Masih bekerja
                        </FieldLabel>
                      </Field>

                      <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <Textarea
                          {...register(`experiences.${index}.description`)}
                          rows={3}
                          placeholder="Bertanggung jawab untuk mengembangkan fitur..."
                        />
                        <FieldDescription>
                          Pisahkan tiap poin dengan menekan Enter agar tampil
                          sebagai daftar.
                        </FieldDescription>
                        <FieldError>
                          {errors.experiences?.[index]?.description?.message}
                        </FieldError>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Keahlian</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => skills.append({ name: "", level: "intermediate" })}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {skills.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Wrench className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data keahlian</p>
                <p className="text-sm">
                  Tambahkan keahlian teknis atau non-teknis
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {skills.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Field className="flex-1">
                      <Input
                        placeholder="Contoh: React.js, Python, Manajemen Proyek"
                        {...register(`skills.${index}.name`)}
                        className={cn(
                          errors.skills?.[index]?.name && "border-destructive"
                        )}
                      />
                      <FieldError>
                        {errors.skills?.[index]?.name?.message}
                      </FieldError>
                    </Field>
                    <Field className="w-40">
                      <Select
                        value={watch(`skills.${index}.level`)}
                        onValueChange={(v) =>
                          setValue(
                            `skills.${index}.level`,
                            v as
                              | "beginner"
                              | "intermediate"
                              | "advanced"
                              | "expert"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          {SKILL_LEVEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError>
                        {errors.skills?.[index]?.level?.message}
                      </FieldError>
                    </Field>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => skills.remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Sertifikasi</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                certificates.append({
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
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {certificates.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data sertifikasi</p>
                <p className="text-sm">
                  Tambahkan sertifikasi profesional yang dimiliki
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        Sertifikat #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => certificates.remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>Judul *</FieldLabel>
                          <Input
                            {...register(`certificates.${index}.title`)}
                            placeholder="AWS Certified Solutions Architect"
                            className={cn(
                              errors.certificates?.[index]?.title &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {errors.certificates?.[index]?.title?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Penerbit *</FieldLabel>
                          <Input
                            {...register(`certificates.${index}.issuer`)}
                            placeholder="Amazon Web Services"
                            className={cn(
                              errors.certificates?.[index]?.issuer &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {errors.certificates?.[index]?.issuer?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field>
                          <FieldLabel>Bulan Terbit</FieldLabel>
                          <Select
                            value={String(
                              watch(`certificates.${index}.issue_month`) || 1
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `certificates.${index}.issue_month`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.certificates?.[index]?.issue_month?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Terbit</FieldLabel>
                          <Select
                            value={String(
                              watch(`certificates.${index}.issue_year`) ||
                                currentYear
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `certificates.${index}.issue_year`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.certificates?.[index]?.issue_year?.message}
                          </FieldError>
                        </Field>

                        <Field>
                          <FieldLabel>Bulan Kedaluwarsa</FieldLabel>
                          <Select
                            value={String(
                              watch(`certificates.${index}.expiry_month`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `certificates.${index}.expiry_month`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(`certificates.${index}.no_expiry`)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="0">-</SelectItem>
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {
                              errors.certificates?.[index]?.expiry_month
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Kedaluwarsa</FieldLabel>
                          <Select
                            value={String(
                              watch(`certificates.${index}.expiry_year`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `certificates.${index}.expiry_year`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(`certificates.${index}.no_expiry`)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              <SelectItem value="0">-</SelectItem>
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.certificates?.[index]?.expiry_year?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <Field
                        orientation="horizontal"
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`cert-no-expiry-${index}`}
                          className="rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          checked={watch(`certificates.${index}.no_expiry`)}
                          onCheckedChange={(v) => {
                            setValue(`certificates.${index}.no_expiry`, !!v);
                            if (v) {
                              setValue(`certificates.${index}.expiry_month`, 0);
                              setValue(`certificates.${index}.expiry_year`, 0);
                            }
                          }}
                        />
                        <FieldLabel
                          htmlFor={`cert-no-expiry-${index}`}
                          className="font-normal"
                        >
                          Tidak ada masa berlaku
                        </FieldLabel>
                      </Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>ID Kredensial</FieldLabel>
                          <Input
                            {...register(`certificates.${index}.credential_id`)}
                            placeholder="AWS-12345678"
                          />
                          <FieldError>
                            {
                              errors.certificates?.[index]?.credential_id
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>URL Kredensial</FieldLabel>
                          <Input
                            {...register(
                              `certificates.${index}.credential_url`
                            )}
                            placeholder="https://aws.amazon.com/verify..."
                          />
                          <FieldError>
                            {
                              errors.certificates?.[index]?.credential_url
                                ?.message
                            }
                          </FieldError>
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <Textarea
                          {...register(`certificates.${index}.description`)}
                          rows={2}
                          placeholder="Sertifikasi untuk arsitektur cloud..."
                        />
                        <FieldError>
                          {errors.certificates?.[index]?.description?.message}
                        </FieldError>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Awards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Penghargaan</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                awards.append({
                  title: "",
                  issuer: "",
                  description: "",
                  year: currentYear,
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {awards.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data penghargaan</p>
                <p className="text-sm">
                  Tambahkan penghargaan atau prestasi yang diraih
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {awards.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        Penghargaan #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => awards.remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field>
                        <FieldLabel>Judul *</FieldLabel>
                        <Input
                          {...register(`awards.${index}.title`)}
                          placeholder="Employee of the Year"
                          className={cn(
                            errors.awards?.[index]?.title &&
                              "border-destructive"
                          )}
                        />
                        <FieldError>
                          {errors.awards?.[index]?.title?.message}
                        </FieldError>
                      </Field>
                      <Field>
                        <FieldLabel>Pemberi *</FieldLabel>
                        <Input
                          {...register(`awards.${index}.issuer`)}
                          placeholder="PT Teknologi Maju"
                          className={cn(
                            errors.awards?.[index]?.issuer &&
                              "border-destructive"
                          )}
                        />
                        <FieldError>
                          {errors.awards?.[index]?.issuer?.message}
                        </FieldError>
                      </Field>
                      <Field>
                        <FieldLabel>Tahun</FieldLabel>
                        <Select
                          value={String(
                            watch(`awards.${index}.year`) || currentYear
                          )}
                          onValueChange={(v) =>
                            setValue(`awards.${index}.year`, parseInt(v))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-50 max-h-48">
                            {yearOptions.map((y) => (
                              <SelectItem key={y} value={String(y)}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError>
                          {errors.awards?.[index]?.year?.message}
                        </FieldError>
                      </Field>
                      <Field className="md:col-span-3">
                        <FieldLabel>Deskripsi</FieldLabel>
                        <Textarea
                          {...register(`awards.${index}.description`)}
                          rows={2}
                          placeholder="Penghargaan atas kinerja luar biasa..."
                        />
                        <FieldError>
                          {errors.awards?.[index]?.description?.message}
                        </FieldError>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organizations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Organisasi</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                organizations.append({
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
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {organizations.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data organisasi</p>
                <p className="text-sm">
                  Tambahkan pengalaman organisasi atau sukarelawan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {organizations.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        Organisasi #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => organizations.remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>Nama Organisasi *</FieldLabel>
                          <Input
                            {...register(
                              `organizations.${index}.organization_name`
                            )}
                            placeholder="Himpunan Mahasiswa Informatika"
                            className={cn(
                              errors.organizations?.[index]
                                ?.organization_name && "border-destructive"
                            )}
                          />
                          <FieldError>
                            {
                              errors.organizations?.[index]?.organization_name
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Jabatan *</FieldLabel>
                          <Input
                            {...register(`organizations.${index}.role_title`)}
                            placeholder="Ketua Umum"
                            className={cn(
                              errors.organizations?.[index]?.role_title &&
                                "border-destructive"
                            )}
                          />
                          <FieldError>
                            {errors.organizations?.[index]?.role_title?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tipe Organisasi *</FieldLabel>
                          <Select
                            value={watch(
                              `organizations.${index}.organization_type`
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `organizations.${index}.organization_type`,
                                v as
                                  | "student"
                                  | "professional"
                                  | "volunteer"
                                  | "community"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {ORGANIZATION_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {
                              errors.organizations?.[index]?.organization_type
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Lokasi</FieldLabel>
                          <Input
                            {...register(`organizations.${index}.location`)}
                            placeholder="Bandung"
                          />
                          <FieldError>
                            {errors.organizations?.[index]?.location?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field>
                          <FieldLabel>Bulan Mulai</FieldLabel>
                          <Select
                            value={String(
                              watch(`organizations.${index}.start_month`) || 1
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `organizations.${index}.start_month`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {
                              errors.organizations?.[index]?.start_month
                                ?.message
                            }
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Mulai</FieldLabel>
                          <Select
                            value={String(
                              watch(`organizations.${index}.start_year`) ||
                                currentYear
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `organizations.${index}.start_year`,
                                parseInt(v)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.organizations?.[index]?.start_year?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Bulan Selesai</FieldLabel>
                          <Select
                            value={String(
                              watch(`organizations.${index}.end_month`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `organizations.${index}.end_month`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(
                              `organizations.${index}.is_current`
                            )}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <SelectItem value="0">-</SelectItem>
                              {MONTH_OPTIONS.map((m) => (
                                <SelectItem
                                  key={m.value}
                                  value={String(m.value)}
                                >
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.organizations?.[index]?.end_month?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>Tahun Selesai</FieldLabel>
                          <Select
                            value={String(
                              watch(`organizations.${index}.end_year`) || 0
                            )}
                            onValueChange={(v) =>
                              setValue(
                                `organizations.${index}.end_year`,
                                parseInt(v)
                              )
                            }
                            disabled={watch(
                              `organizations.${index}.is_current`
                            )}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-48">
                              <SelectItem value="0">-</SelectItem>
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>
                            {errors.organizations?.[index]?.end_year?.message}
                          </FieldError>
                        </Field>
                      </div>

                      <Field
                        orientation="horizontal"
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`org-current-${index}`}
                          className="rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          checked={watch(`organizations.${index}.is_current`)}
                          onCheckedChange={(v) => {
                            setValue(`organizations.${index}.is_current`, !!v);
                            if (v) {
                              setValue(`organizations.${index}.end_month`, 0);
                              setValue(`organizations.${index}.end_year`, 0);
                            }
                          }}
                        />
                        <FieldLabel
                          htmlFor={`org-current-${index}`}
                          className="font-normal"
                        >
                          Masih berlangsung
                        </FieldLabel>
                      </Field>

                      <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <Textarea
                          {...register(`organizations.${index}.description`)}
                          rows={2}
                          placeholder="Memimpin organisasi dengan 100 anggota..."
                        />
                        <FieldDescription>
                          Pisahkan tiap poin dengan menekan Enter agar tampil
                          sebagai daftar.
                        </FieldDescription>
                        <FieldError>
                          {errors.organizations?.[index]?.description?.message}
                        </FieldError>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Media Sosial</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => socialLinks.append({ platform: "", url: "" })}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah
            </Button>
          </CardHeader>

          <CardContent className="space-y-3 pt-4">
            {socialLinks.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Share2 className="h-6 w-6" />
                </div>
                <p className="font-medium">Belum ada data media sosial</p>
                <p className="text-sm">
                  Tambahkan tautan profil profesional Anda
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {socialLinks.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Field className="w-40">
                      <Input
                        placeholder="LinkedIn"
                        {...register(`social_links.${index}.platform`)}
                        className={cn(
                          errors.social_links?.[index]?.platform &&
                            "border-destructive"
                        )}
                      />
                      <FieldError>
                        {errors.social_links?.[index]?.platform?.message}
                      </FieldError>
                    </Field>
                    <Field className="flex-1">
                      <Input
                        placeholder="https://linkedin.com/in/johndoe"
                        {...register(`social_links.${index}.url`)}
                        className={cn(
                          errors.social_links?.[index]?.url &&
                            "border-destructive"
                        )}
                      />
                      <FieldError>
                        {errors.social_links?.[index]?.url?.message}
                      </FieldError>
                    </Field>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => socialLinks.remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3 pt-6 border-t mt-8">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
