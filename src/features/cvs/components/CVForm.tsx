import { useMemo, useState } from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/lib/auth";
import {
  Plus,
  Trash2,
  GraduationCap,
  Briefcase,
  FileText,
  Wrench,
  Award,
  Trophy,
  Users,
  Share2,
  Layers,
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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { PhotoUpload } from "@/components/PhotoUpload";
import { CVParagraphTemplateModal } from "./CVParagraphTemplateModal";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useTemplates } from "@/features/landing/api/get-templates";
import { buildImageUrl } from "@/lib/utils";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";
import {
  type CV,
  DEGREE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
  LANGUAGE_OPTIONS,
  type LabelLanguage,
} from "@/types/cv";
import { SOCIAL_PLATFORM_OPTIONS, type SocialPlatform } from "@/types/social";
import type { CVParagraphType } from "@/types/template";
import { SKILL_CATEGORY_LABELS } from "@/types/skill-categories";
import type { SkillCategory } from "@/types/cv";
import {
  cvSchema,
  normalizeProjects,
  type CVFormData,
  type CVFormInput,
} from "../api/create-cv";

interface CVFormProps {
  initialData?: Partial<CV>;
  onSubmit: (data: CVFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: unknown;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

export function CVForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: CVFormProps) {
  const { data: user } = useUser();
  
  const form = useForm<CVFormInput>({
    resolver: zodResolver(cvSchema, undefined, { raw: true }),
    defaultValues: {
      template_id: initialData?.template_id || "",
      name: initialData?.name || user?.name || "",
      headline: initialData?.headline || user?.headline || "",
      email: initialData?.email || user?.email || "",
      phone: initialData?.phone || user?.phone || "",
      address: initialData?.address || user?.location || "",
      about: initialData?.about || user?.bio || "",
      photo: initialData?.photo || user?.avatar || "",
      educations: (initialData?.educations || []) as CVFormInput["educations"],
      certificates: (initialData?.certificates ||
        []) as CVFormInput["certificates"],
      experiences: (initialData?.experiences ||
        []) as CVFormInput["experiences"],
      skills: (initialData?.skills || []) as CVFormInput["skills"],
      awards: (initialData?.awards || []) as CVFormInput["awards"],
      social_links: (initialData?.social_links ||
        []) as CVFormInput["social_links"],
      organizations: (initialData?.organizations ||
        []) as CVFormInput["organizations"],
      projects: (normalizeProjects(initialData?.projects) ||
        []) as CVFormInput["projects"],
      language: initialData?.language ?? undefined,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  useServerValidation(error, form);

  const languageValue =
    (useWatch({ control, name: "language" }) as "id" | "en" | undefined) ?? "";
  const resolvedLanguage: LabelLanguage = languageValue === "en" ? "en" : "id";
  const skillCategoryLabels = SKILL_CATEGORY_LABELS[resolvedLanguage];
  const skillCategoryItems = useMemo(
    () => Object.keys(skillCategoryLabels),
    [skillCategoryLabels],
  );
  const socialPlatformLabelByValue = useMemo(
    () =>
      new Map<SocialPlatform, string>(
        SOCIAL_PLATFORM_OPTIONS.map((option) => [option.value, option.label]),
      ),
    [],
  );
  const templateIdValue = useWatch({ control, name: "template_id" }) ?? "";
  const nameValue = useWatch({ control, name: "name" }) ?? "";
  const photoValue = useWatch({ control, name: "photo" }) ?? "";
  const aboutValue = useWatch({ control, name: "about" }) ?? "";
  const educationsValue = useWatch({ control, name: "educations" }) ?? [];
  const experiencesValue = useWatch({ control, name: "experiences" }) ?? [];
  const skillsValue = useWatch({ control, name: "skills" }) ?? [];
  const awardsValue = useWatch({ control, name: "awards" }) ?? [];
  const certificatesValue = useWatch({ control, name: "certificates" }) ?? [];
  const organizationsValue = useWatch({ control, name: "organizations" }) ?? [];
  const projectsValue = useWatch({ control, name: "projects" }) ?? [];

  const selectedTemplateLanguage = languageValue
    ? (languageValue as "id" | "en")
    : undefined;
  const { data: templatesData, isLoading: isTemplatesLoading } = useTemplates({
    params: { type: "cv", language: selectedTemplateLanguage },
    queryConfig: { enabled: !!selectedTemplateLanguage },
  });

  const apiTemplates = selectedTemplateLanguage
    ? templatesData?.items.map((t) => ({
        ...t,
        previewImage: buildImageUrl(t.preview),
      })) || []
    : [];

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [activeParagraphType, setActiveParagraphType] =
    useState<CVParagraphType | null>(null);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<
    number | null
  >(null);

  const educations = useFieldArray({ control, name: "educations" });
  const certificates = useFieldArray({ control, name: "certificates" });
  const experiences = useFieldArray({ control, name: "experiences" });
  const skills = useFieldArray({ control, name: "skills" });
  const awards = useFieldArray({ control, name: "awards" });
  const socialLinks = useFieldArray({ control, name: "social_links" });
  const organizations = useFieldArray({ control, name: "organizations" });
  const projects = useFieldArray({ control, name: "projects" });

  const handleOpenTemplateModal = (type: CVParagraphType, index?: number) => {
    setActiveParagraphType(type);
    setActiveParagraphIndex(typeof index === "number" ? index : null);
    setTemplateModalOpen(true);
  };

  const handleSelectTemplate = (content: string) => {
    if (!activeParagraphType) return;

    if (activeParagraphType === "about") {
      setValue("about", content);
      return;
    }

    if (activeParagraphIndex === null) return;

    if (activeParagraphType === "experience") {
      setValue(`experiences.${activeParagraphIndex}.description`, content);
      return;
    }

    if (activeParagraphType === "organization") {
      setValue(`organizations.${activeParagraphIndex}.description`, content);
      return;
    }

    if (activeParagraphType === "project") {
      setValue(`projects.${activeParagraphIndex}.description`, content);
    }
  };

  const getCurrentParagraphValue = () => {
    if (!activeParagraphType) return "";

    if (activeParagraphType === "about") {
      return aboutValue || "";
    }

    if (activeParagraphIndex === null) return "";

    if (activeParagraphType === "experience") {
      return experiencesValue?.[activeParagraphIndex]?.description || "";
    }

    if (activeParagraphType === "organization") {
      return organizationsValue?.[activeParagraphIndex]?.description || "";
    }

    if (activeParagraphType === "project") {
      return projectsValue?.[activeParagraphIndex]?.description || "";
    }

    return "";
  };

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(cvSchema.parse(data));
        }, displayFormErrors)}
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
                    <FieldLabel>
                      Bahasa <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={languageValue}
                      onValueChange={(v) => {
                        setValue("language", v as "id" | "en");
                        setValue("template_id", "");
                      }}
                    >
                      <SelectTrigger
                        className={cn(errors.language && "border-destructive")}
                      >
                        <SelectValue placeholder="Pilih Bahasa" />
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
                    <Field>
                      <FieldLabel>
                        Pilih Template{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <TemplateSelector
                        templates={apiTemplates}
                        value={templateIdValue}
                        onChange={(v) => setValue("template_id", v)}
                        hasError={!!errors.template_id}
                        disabled={!selectedTemplateLanguage}
                      />
                      <FieldError>{errors.template_id?.message}</FieldError>
                    </Field>
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
                    name={nameValue}
                    quality={75}
                    webp={false}
                    format="jpg,png"
                    hasError={!!errors.photo}
                  />
                  <FieldError className="mt-2">
                    {errors.photo?.message}
                  </FieldError>
                </div>

                <Field>
                  <FieldLabel htmlFor="name">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    className={cn(errors.name && "border-destructive")}
                  />
                  <FieldError>{errors.name?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="headline">
                    Headline <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="headline"
                    {...register("headline")}
                    placeholder="Software Engineer | Full Stack Developer"
                    className={cn(errors.headline && "border-destructive")}
                  />
                  <FieldError>{errors.headline?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </FieldLabel>
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
                  <FieldLabel htmlFor="phone">
                    Nomor Telepon <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="081234567890"
                    className={cn(errors.phone && "border-destructive")}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="address">
                    Alamat <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Jl. Jend. Sudirman No. 1, Jakarta"
                    className={cn(errors.address && "border-destructive")}
                  />
                  <FieldError>{errors.address?.message}</FieldError>
                </Field>

                <Field className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="about">
                      Tentang Saya <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenTemplateModal("about")}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Gunakan Template
                    </Button>
                  </div>
                  <Textarea
                    id="about"
                    {...register("about")}
                    rows={4}
                    placeholder="Ceritakan tentang diri Anda..."
                    className={cn(errors.about && "border-destructive")}
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
                    degree: "",
                    school_name: "",
                    school_location: "",
                    major: "",
                    start_month: undefined,
                    start_year: undefined,
                    end_month: undefined,
                    end_year: undefined,
                    is_current: false,
                    gpa: undefined,
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
                            <FieldLabel>
                              Jenjang{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <input
                              type="hidden"
                              {...register(`educations.${index}.degree`)}
                            />
                            <Select
                              value={
                                typeof educationsValue?.[index]?.degree ===
                                "string"
                                  ? educationsValue?.[index]?.degree
                                  : ""
                              }
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
                                  { shouldDirty: true, shouldValidate: true },
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.educations?.[index]?.degree &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Jenjang" />
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
                            <FieldLabel>
                              Nama Sekolah/Universitas{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`educations.${index}.school_name`)}
                              placeholder="Universitas Indonesia"
                              className={cn(
                                errors.educations?.[index]?.school_name &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.educations?.[index]?.school_name?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Lokasi <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(
                                `educations.${index}.school_location`,
                              )}
                              placeholder="Depok, Jawa Barat"
                              className={cn(
                                errors.educations?.[index]?.school_location &&
                                  "border-destructive",
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
                            <FieldLabel>
                              Jurusan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`educations.${index}.major`)}
                              placeholder="Teknik Informatika"
                              className={cn(
                                errors.educations?.[index]?.major &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.educations?.[index]?.major?.message}
                            </FieldError>
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Field>
                            <FieldLabel>
                              Bulan Mulai{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                educationsValue?.[index]?.start_month
                                  ? String(
                                      educationsValue?.[index]?.start_month,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `educations.${index}.start_month`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.educations?.[index]?.start_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Mulai" />
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
                            <FieldLabel>
                              Tahun Mulai{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                educationsValue?.[index]?.start_year
                                  ? String(educationsValue?.[index]?.start_year)
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `educations.${index}.start_year`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.educations?.[index]?.start_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Mulai" />
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
                            <FieldLabel>
                              Bulan Selesai{" "}
                              {!educationsValue?.[index]?.is_current && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                educationsValue?.[index]?.end_month === 0
                                  ? ""
                                  : educationsValue?.[index]?.end_month
                                    ? String(
                                        educationsValue?.[index]?.end_month,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `educations.${index}.end_month`,
                                  parseInt(v),
                                )
                              }
                              disabled={!!educationsValue?.[index]?.is_current}
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.educations?.[index]?.end_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Selesai" />
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
                              {errors.educations?.[index]?.end_month?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tahun Selesai{" "}
                              {!educationsValue?.[index]?.is_current && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                educationsValue?.[index]?.end_year === 0
                                  ? ""
                                  : educationsValue?.[index]?.end_year
                                    ? String(educationsValue?.[index]?.end_year)
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `educations.${index}.end_year`,
                                  parseInt(v),
                                )
                              }
                              disabled={!!educationsValue?.[index]?.is_current}
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.educations?.[index]?.end_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Selesai" />
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
                            className={cn(
                              "rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                              errors.educations?.[index]?.is_current &&
                                "border-destructive",
                            )}
                            checked={!!educationsValue?.[index]?.is_current}
                            onCheckedChange={(v) => {
                              const isCurrent = !!v;
                              setValue(
                                `educations.${index}.is_current`,
                                isCurrent,
                                { shouldDirty: true, shouldValidate: true },
                              );
                              if (isCurrent) {
                                setValue(
                                  `educations.${index}.end_month`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                                setValue(
                                  `educations.${index}.end_year`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              } else {
                                trigger([
                                  `educations.${index}.end_month`,
                                  `educations.${index}.end_year`,
                                ]);
                              }
                            }}
                          />
                          <FieldLabel
                            htmlFor={`edu-current-${index}`}
                            className="font-normal"
                          >
                            Masih berlangsung
                          </FieldLabel>
                          <FieldError>
                            {errors.educations?.[index]?.is_current?.message}
                          </FieldError>
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
                            className={cn(
                              errors.educations?.[index]?.gpa &&
                                "border-destructive",
                            )}
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
                            className={cn(
                              errors.educations?.[index]?.description &&
                                "border-destructive",
                            )}
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
                    job_type: undefined,
                    start_month: undefined,
                    start_year: undefined,
                    end_month: undefined,
                    end_year: undefined,
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
                            <FieldLabel>
                              Jabatan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`experiences.${index}.job_title`)}
                              placeholder="Senior Software Engineer"
                              className={cn(
                                errors.experiences?.[index]?.job_title &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.experiences?.[index]?.job_title?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Nama Perusahaan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`experiences.${index}.company_name`)}
                              placeholder="PT Teknologi Maju"
                              className={cn(
                                errors.experiences?.[index]?.company_name &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {
                                errors.experiences?.[index]?.company_name
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Lokasi <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(
                                `experiences.${index}.company_location`,
                              )}
                              placeholder="Jakarta Selatan"
                              className={cn(
                                errors.experiences?.[index]?.company_location &&
                                  "border-destructive",
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
                            <FieldLabel>
                              Tipe Pekerjaan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                typeof experiencesValue?.[index]?.job_type ===
                                "string"
                                  ? experiencesValue?.[index]?.job_type
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `experiences.${index}.job_type`,
                                  v as
                                    | "full_time"
                                    | "part_time"
                                    | "contract"
                                    | "internship"
                                    | "freelance",
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.experiences?.[index]?.job_type &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tipe Pekerjaan" />
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
                            <FieldLabel>
                              Bulan Mulai{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                experiencesValue?.[index]?.start_month
                                  ? String(
                                      experiencesValue?.[index]?.start_month,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `experiences.${index}.start_month`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.experiences?.[index]?.start_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Mulai" />
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
                                errors.experiences?.[index]?.start_month
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tahun Mulai{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                experiencesValue?.[index]?.start_year
                                  ? String(
                                      experiencesValue?.[index]?.start_year,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `experiences.${index}.start_year`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.experiences?.[index]?.start_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Mulai" />
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
                            <FieldLabel>
                              Bulan Selesai{" "}
                              {!experiencesValue?.[index]?.is_current && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                experiencesValue?.[index]?.end_month === 0
                                  ? ""
                                  : experiencesValue?.[index]?.end_month
                                    ? String(
                                        experiencesValue?.[index]?.end_month,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `experiences.${index}.end_month`,
                                  parseInt(v),
                                )
                              }
                              disabled={!!experiencesValue?.[index]?.is_current}
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.experiences?.[index]?.end_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Selesai" />
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
                              {errors.experiences?.[index]?.end_month?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tahun Selesai{" "}
                              {!experiencesValue?.[index]?.is_current && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                experiencesValue?.[index]?.end_year === 0
                                  ? ""
                                  : experiencesValue?.[index]?.end_year
                                    ? String(
                                        experiencesValue?.[index]?.end_year,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `experiences.${index}.end_year`,
                                  parseInt(v),
                                )
                              }
                              disabled={!!experiencesValue?.[index]?.is_current}
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.experiences?.[index]?.end_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Selesai" />
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
                            className={cn(
                              "rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                              errors.experiences?.[index]?.is_current &&
                                "border-destructive",
                            )}
                            checked={!!experiencesValue?.[index]?.is_current}
                            onCheckedChange={(v) => {
                              const isCurrent = !!v;
                              setValue(
                                `experiences.${index}.is_current`,
                                isCurrent,
                                { shouldDirty: true, shouldValidate: true },
                              );
                              if (isCurrent) {
                                setValue(
                                  `experiences.${index}.end_month`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                                setValue(
                                  `experiences.${index}.end_year`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              } else {
                                trigger([
                                  `experiences.${index}.end_month`,
                                  `experiences.${index}.end_year`,
                                ]);
                              }
                            }}
                          />
                          <FieldLabel
                            htmlFor={`exp-current-${index}`}
                            className="font-normal"
                          >
                            Masih bekerja
                          </FieldLabel>
                          <FieldError>
                            {errors.experiences?.[index]?.is_current?.message}
                          </FieldError>
                        </Field>

                        <Field>
                          <div className="flex items-center justify-between">
                            <FieldLabel>Deskripsi</FieldLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpenTemplateModal("experience", index)
                              }
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Gunakan Template
                            </Button>
                          </div>
                          <Textarea
                            {...register(`experiences.${index}.description`)}
                            rows={3}
                            placeholder="Bertanggung jawab untuk mengembangkan fitur..."
                            className={cn(
                              errors.experiences?.[index]?.description &&
                                "border-destructive",
                            )}
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
                onClick={() =>
                  skills.append({
                    name: "",
                    level: undefined,
                    skill_category: "",
                  })
                }
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
                      <Field className="w-48">
                        <FieldLabel>
                          Kategori <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox
                          items={skillCategoryItems}
                          value={skillsValue?.[index]?.skill_category || null}
                          onValueChange={(value) =>
                            setValue(
                              `skills.${index}.skill_category`,
                              (value ?? "") as SkillCategory,
                              { shouldDirty: true, shouldValidate: true },
                            )
                          }
                          itemToStringLabel={(value) =>
                            skillCategoryLabels[value as SkillCategory] ?? ""
                          }
                        >
                          <ComboboxInput
                            className={cn(
                              "w-full",
                              errors.skills?.[index]?.skill_category &&
                                "border-destructive",
                            )}
                            placeholder="Pilih Kategori"
                            aria-invalid={
                              !!errors.skills?.[index]?.skill_category
                            }
                            showClear
                          />
                          <ComboboxContent>
                            <ComboboxEmpty>
                              Kategori tidak ditemukan
                            </ComboboxEmpty>
                            <ComboboxList>
                              {(key) => (
                                <ComboboxItem key={key} value={key}>
                                  {skillCategoryLabels[key as SkillCategory]}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                        <FieldError>
                          {typeof errors.skills?.[index]?.skill_category
                            ?.message === "string"
                            ? errors.skills?.[index]?.skill_category?.message
                            : undefined}
                        </FieldError>
                      </Field>
                      <Field className="flex-1">
                        <FieldLabel>
                          Nama Keahlian{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          placeholder="Contoh: React.js, Python, Manajemen Proyek"
                          {...register(`skills.${index}.name`)}
                          className={cn(
                            errors.skills?.[index]?.name &&
                              "border-destructive",
                          )}
                        />
                        <FieldError>
                          {errors.skills?.[index]?.name?.message}
                        </FieldError>
                      </Field>
                      <Field className="w-40">
                        <FieldLabel>
                          Level Keahlian{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select
                          value={
                            typeof skillsValue?.[index]?.level === "string"
                              ? skillsValue?.[index]?.level
                              : ""
                          }
                          onValueChange={(v) =>
                            setValue(
                              `skills.${index}.level`,
                              v as
                                | "beginner"
                                | "intermediate"
                                | "advanced"
                                | "expert",
                            )
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              errors.skills?.[index]?.level &&
                                "border-destructive",
                            )}
                          >
                            <SelectValue placeholder="Pilih Level Keahlian" />
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
                        className="mt-7 self-start"
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
                    issue_month: undefined,
                    issue_year: undefined,
                    expiry_month: undefined,
                    expiry_year: undefined,
                    no_expiry: false,
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
                            <FieldLabel>
                              Judul <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`certificates.${index}.title`)}
                              placeholder="AWS Certified Solutions Architect"
                              className={cn(
                                errors.certificates?.[index]?.title &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.certificates?.[index]?.title?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Penerbit{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`certificates.${index}.issuer`)}
                              placeholder="Amazon Web Services"
                              className={cn(
                                errors.certificates?.[index]?.issuer &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.certificates?.[index]?.issuer?.message}
                            </FieldError>
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Field>
                            <FieldLabel>
                              Bulan Terbit{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                certificatesValue?.[index]?.issue_month
                                  ? String(
                                      certificatesValue?.[index]?.issue_month,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `certificates.${index}.issue_month`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.certificates?.[index]?.issue_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Terbit" />
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
                                errors.certificates?.[index]?.issue_month
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tahun Terbit{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                certificatesValue?.[index]?.issue_year
                                  ? String(
                                      certificatesValue?.[index]?.issue_year,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `certificates.${index}.issue_year`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.certificates?.[index]?.issue_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Terbit" />
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
                              {
                                errors.certificates?.[index]?.issue_year
                                  ?.message
                              }
                            </FieldError>
                          </Field>

                          <Field>
                            <FieldLabel>
                              Bulan Kedaluwarsa{" "}
                              {!certificatesValue?.[index]?.no_expiry && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                certificatesValue?.[index]?.expiry_month === 0
                                  ? ""
                                  : certificatesValue?.[index]?.expiry_month
                                    ? String(
                                        certificatesValue?.[index]
                                          ?.expiry_month,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `certificates.${index}.expiry_month`,
                                  parseInt(v),
                                )
                              }
                              disabled={!!certificatesValue?.[index]?.no_expiry}
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.certificates?.[index]?.expiry_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Kedaluwarsa" />
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
                                errors.certificates?.[index]?.expiry_month
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tahun Kedaluwarsa{" "}
                              {!certificatesValue?.[index]?.no_expiry && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                certificatesValue?.[index]?.expiry_year === 0
                                  ? ""
                                  : certificatesValue?.[index]?.expiry_year
                                    ? String(
                                        certificatesValue?.[index]?.expiry_year,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `certificates.${index}.expiry_year`,
                                  parseInt(v),
                                )
                              }
                              disabled={!!certificatesValue?.[index]?.no_expiry}
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.certificates?.[index]?.expiry_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Kedaluwarsa" />
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
                              {
                                errors.certificates?.[index]?.expiry_year
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                        </div>

                        <Field
                          orientation="horizontal"
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`cert-no-expiry-${index}`}
                            className={cn(
                              "rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                              errors.certificates?.[index]?.no_expiry &&
                                "border-destructive",
                            )}
                            checked={!!certificatesValue?.[index]?.no_expiry}
                            onCheckedChange={(v) => {
                              const noExpiry = !!v;
                              setValue(
                                `certificates.${index}.no_expiry`,
                                noExpiry,
                                { shouldDirty: true, shouldValidate: true },
                              );
                              if (noExpiry) {
                                setValue(
                                  `certificates.${index}.expiry_month`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                                setValue(
                                  `certificates.${index}.expiry_year`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              } else {
                                trigger([
                                  `certificates.${index}.expiry_month`,
                                  `certificates.${index}.expiry_year`,
                                ]);
                              }
                            }}
                          />
                          <FieldLabel
                            htmlFor={`cert-no-expiry-${index}`}
                            className="font-normal"
                          >
                            Tidak ada masa berlaku
                          </FieldLabel>
                          <FieldError>
                            {errors.certificates?.[index]?.no_expiry?.message}
                          </FieldError>
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>ID Kredensial</FieldLabel>
                            <Input
                              {...register(
                                `certificates.${index}.credential_id`,
                              )}
                              placeholder="AWS-12345678"
                              className={cn(
                                errors.certificates?.[index]?.credential_id &&
                                  "border-destructive",
                              )}
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
                                `certificates.${index}.credential_url`,
                              )}
                              placeholder="https://aws.amazon.com/verify..."
                              className={cn(
                                errors.certificates?.[index]?.credential_url &&
                                  "border-destructive",
                              )}
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
                            className={cn(
                              errors.certificates?.[index]?.description &&
                                "border-destructive",
                            )}
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
                    year: undefined,
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
                          <FieldLabel>
                            Judul <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            {...register(`awards.${index}.title`)}
                            placeholder="Employee of the Year"
                            className={cn(
                              errors.awards?.[index]?.title &&
                                "border-destructive",
                            )}
                          />
                          <FieldError>
                            {errors.awards?.[index]?.title?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>
                            Pemberi <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            {...register(`awards.${index}.issuer`)}
                            placeholder="PT Teknologi Maju"
                            className={cn(
                              errors.awards?.[index]?.issuer &&
                                "border-destructive",
                            )}
                          />
                          <FieldError>
                            {errors.awards?.[index]?.issuer?.message}
                          </FieldError>
                        </Field>
                        <Field>
                          <FieldLabel>
                            Tahun <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Select
                            value={
                              awardsValue?.[index]?.year
                                ? String(awardsValue?.[index]?.year)
                                : ""
                            }
                            onValueChange={(v) =>
                              setValue(`awards.${index}.year`, parseInt(v))
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                errors.awards?.[index]?.year &&
                                  "border-destructive",
                              )}
                            >
                              <SelectValue placeholder="Pilih Tahun" />
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
                            className={cn(
                              errors.awards?.[index]?.description &&
                                "border-destructive",
                            )}
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
                    organization_type: "student",
                    location: "",
                    start_month: undefined,
                    start_year: undefined,
                    end_month: undefined,
                    end_year: undefined,
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
                            <FieldLabel>
                              Nama Organisasi{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(
                                `organizations.${index}.organization_name`,
                              )}
                              placeholder="Himpunan Mahasiswa Informatika"
                              className={cn(
                                errors.organizations?.[index]
                                  ?.organization_name && "border-destructive",
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
                            <FieldLabel>
                              Jabatan{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              {...register(`organizations.${index}.role_title`)}
                              placeholder="Ketua Umum"
                              className={cn(
                                errors.organizations?.[index]?.role_title &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {
                                errors.organizations?.[index]?.role_title
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tipe Organisasi{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                organizationsValue?.[index]
                                  ?.organization_type ?? ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `organizations.${index}.organization_type`,
                                  v as
                                    | "student"
                                    | "professional"
                                    | "volunteer"
                                    | "community",
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.organizations?.[index]
                                    ?.organization_type && "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tipe Organisasi" />
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
                              className={cn(
                                errors.organizations?.[index]?.location &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.organizations?.[index]?.location?.message}
                            </FieldError>
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Field>
                            <FieldLabel>
                              Bulan Mulai{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                organizationsValue?.[index]?.start_month
                                  ? String(
                                      organizationsValue?.[index]?.start_month,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `organizations.${index}.start_month`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.organizations?.[index]?.start_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Mulai" />
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
                            <FieldLabel>
                              Tahun Mulai{" "}
                              <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                organizationsValue?.[index]?.start_year
                                  ? String(
                                      organizationsValue?.[index]?.start_year,
                                    )
                                  : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `organizations.${index}.start_year`,
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.organizations?.[index]?.start_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Mulai" />
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
                              {
                                errors.organizations?.[index]?.start_year
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Bulan Selesai{" "}
                              {!organizationsValue?.[index]?.is_current && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                organizationsValue?.[index]?.end_month === 0
                                  ? ""
                                  : organizationsValue?.[index]?.end_month
                                    ? String(
                                        organizationsValue?.[index]?.end_month,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `organizations.${index}.end_month`,
                                  parseInt(v),
                                )
                              }
                              disabled={
                                !!organizationsValue?.[index]?.is_current
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.organizations?.[index]?.end_month &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Bulan Selesai" />
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
                                errors.organizations?.[index]?.end_month
                                  ?.message
                              }
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>
                              Tahun Selesai{" "}
                              {!organizationsValue?.[index]?.is_current && (
                                <span className="text-destructive">*</span>
                              )}
                            </FieldLabel>
                            <Select
                              value={
                                organizationsValue?.[index]?.end_year === 0
                                  ? ""
                                  : organizationsValue?.[index]?.end_year
                                    ? String(
                                        organizationsValue?.[index]?.end_year,
                                      )
                                    : ""
                              }
                              onValueChange={(v) =>
                                setValue(
                                  `organizations.${index}.end_year`,
                                  parseInt(v),
                                )
                              }
                              disabled={
                                !!organizationsValue?.[index]?.is_current
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.organizations?.[index]?.end_year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun Selesai" />
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
                            className={cn(
                              "rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                              errors.organizations?.[index]?.is_current &&
                                "border-destructive",
                            )}
                            checked={!!organizationsValue?.[index]?.is_current}
                            onCheckedChange={(v) => {
                              const isCurrent = !!v;
                              setValue(
                                `organizations.${index}.is_current`,
                                isCurrent,
                                { shouldDirty: true, shouldValidate: true },
                              );
                              if (isCurrent) {
                                setValue(
                                  `organizations.${index}.end_month`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                                setValue(
                                  `organizations.${index}.end_year`,
                                  undefined,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              } else {
                                trigger([
                                  `organizations.${index}.end_month`,
                                  `organizations.${index}.end_year`,
                                ]);
                              }
                            }}
                          />
                          <FieldLabel
                            htmlFor={`org-current-${index}`}
                            className="font-normal"
                          >
                            Masih berlangsung
                          </FieldLabel>
                          <FieldError>
                            {errors.organizations?.[index]?.is_current?.message}
                          </FieldError>
                        </Field>

                        <Field>
                          <div className="flex items-center justify-between">
                            <FieldLabel>Deskripsi</FieldLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpenTemplateModal("organization", index)
                              }
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Gunakan Template
                            </Button>
                          </div>
                          <Textarea
                            {...register(`organizations.${index}.description`)}
                            rows={2}
                            placeholder="Memimpin organisasi dengan 100 anggota..."
                            className={cn(
                              errors.organizations?.[index]?.description &&
                                "border-destructive",
                            )}
                          />
                          <FieldDescription>
                            Pisahkan tiap poin dengan menekan Enter agar tampil
                            sebagai daftar.
                          </FieldDescription>
                          <FieldError>
                            {
                              errors.organizations?.[index]?.description
                                ?.message
                            }
                          </FieldError>
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Proyek</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  projects.append({
                    name: "",
                    description: "",
                    year: undefined,
                    repo_url: "",
                    live_url: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {projects.fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Layers className="h-6 w-6" />
                  </div>
                  <p className="font-medium">Belum ada data proyek</p>
                  <p className="text-sm">
                    Tambahkan proyek yang pernah Anda kerjakan
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          Proyek #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => projects.remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <Field>
                          <FieldLabel>
                            Nama Proyek{" "}
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            {...register(`projects.${index}.name`)}
                            placeholder="Nama proyek"
                            className={cn(
                              errors.projects?.[index]?.name &&
                                "border-destructive",
                            )}
                          />
                          <FieldError>
                            {errors.projects?.[index]?.name?.message}
                          </FieldError>
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Field>
                            <FieldLabel>
                              Tahun <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                              value={
                                projectsValue?.[index]?.year
                                  ? String(projectsValue?.[index]?.year)
                                  : ""
                              }
                              onValueChange={(value) =>
                                setValue(
                                  `projects.${index}.year`,
                                  parseInt(value),
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  errors.projects?.[index]?.year &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Pilih Tahun" />
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
                              {errors.projects?.[index]?.year?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>Repository</FieldLabel>
                            <Input
                              {...register(`projects.${index}.repo_url`)}
                              placeholder="https://github.com/username/project"
                              className={cn(
                                errors.projects?.[index]?.repo_url &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.projects?.[index]?.repo_url?.message}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>Tautan Live</FieldLabel>
                            <Input
                              {...register(`projects.${index}.live_url`)}
                              placeholder="https://project.example.com"
                              className={cn(
                                errors.projects?.[index]?.live_url &&
                                  "border-destructive",
                              )}
                            />
                            <FieldError>
                              {errors.projects?.[index]?.live_url?.message}
                            </FieldError>
                          </Field>
                        </div>
                        <Field>
                          <div className="flex items-center justify-between">
                            <FieldLabel>Deskripsi</FieldLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpenTemplateModal("project", index)
                              }
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Gunakan Template
                            </Button>
                          </div>
                          <Textarea
                            {...register(`projects.${index}.description`)}
                            rows={3}
                            placeholder="Jelaskan peran dan capaian proyek..."
                            className={cn(
                              errors.projects?.[index]?.description &&
                                "border-destructive",
                            )}
                          />
                          <FieldError>
                            {errors.projects?.[index]?.description?.message}
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
                onClick={() =>
                  socialLinks.append({
                    platform: "" as SocialPlatform,
                    url: "",
                  })
                }
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
                      <Field className="w-48">
                        <FieldLabel>
                          Platform <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Controller
                          control={control}
                          name={`social_links.${index}.platform`}
                          render={({ field: controllerField }) => (
                            <Combobox
                              items={SOCIAL_PLATFORM_OPTIONS.map(
                                (option) => option.value,
                              )}
                              value={controllerField.value || null}
                              onValueChange={(value) =>
                                controllerField.onChange(value ?? "")
                              }
                              itemToStringLabel={(value) =>
                                socialPlatformLabelByValue.get(
                                  value as SocialPlatform,
                                ) ?? ""
                              }
                            >
                              <ComboboxInput
                                className={cn(
                                  "w-full",
                                  errors.social_links?.[index]?.platform &&
                                    "border-destructive",
                                )}
                                placeholder="Pilih Platform"
                                aria-invalid={
                                  !!errors.social_links?.[index]?.platform
                                }
                                showClear
                              />
                              <ComboboxContent>
                                <ComboboxEmpty>
                                  Platform tidak ditemukan
                                </ComboboxEmpty>
                                <ComboboxList>
                                  {(value) => (
                                    <ComboboxItem key={value} value={value}>
                                      {socialPlatformLabelByValue.get(
                                        value as SocialPlatform,
                                      ) ?? ""}
                                    </ComboboxItem>
                                  )}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          )}
                        />
                        <FieldError>
                          {errors.social_links?.[index]?.platform?.message}
                        </FieldError>
                      </Field>
                      <Field className="flex-1">
                        <FieldLabel>
                          URL <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          placeholder="https://linkedin.com/in/johndoe"
                          {...register(`social_links.${index}.url`)}
                          className={cn(
                            errors.social_links?.[index]?.url &&
                              "border-destructive",
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
                        className="mt-7 self-start"
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

      <CVParagraphTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        paragraphType={activeParagraphType}
        currentValue={getCurrentParagraphValue()}
        onSelectTemplate={handleSelectTemplate}
        language={resolvedLanguage}
      />
    </>
  );
}
