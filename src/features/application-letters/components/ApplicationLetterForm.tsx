import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dayjs } from "@/lib/date";
import { CalendarIcon, FileText } from "lucide-react";
import { ParagraphTemplateModal } from "./ParagraphTemplateModal";
import type { ParagraphType } from "@/data/paragraphTemplates";
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
import { cn, buildImageUrl } from "@/lib/utils";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { SignatureUpload } from "./SignatureUpload";
import { TemplateSelector } from "@/components/ui/template-selector";
import {
  type ApplicationLetter,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/applicationLetter";
import { useTemplates } from "@/features/landing/api/get-templates";
import { useFormErrors } from "@/hooks/use-form-errors";

const applicationLetterSchema = z.object({
  template_id: z.string().optional(),
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  birth_place_date: z.string().min(1, "Tempat, tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"]),
  marital_status: z.enum(["single", "married", "widowed", "divorced"]),
  education: z.string().min(1, "Pendidikan wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  subject: z.string().min(1, "Subjek wajib diisi"),
  applicant_city: z.string().min(1, "Kota pelamar wajib diisi"),
  application_date: z.string().min(1, "Tanggal lamaran wajib diisi"),
  receiver_title: z.string().min(1, "Jabatan penerima wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  company_city: z.string().min(1, "Kota perusahaan wajib diisi"),
  company_address: z.string().min(1, "Alamat perusahaan wajib diisi"),
  opening_paragraph: z.string().min(1, "Paragraf pembuka wajib diisi"),
  body_paragraph: z.string().min(1, "Paragraf isi wajib diisi"),
  attachments: z.string().optional(),
  closing_paragraph: z.string().min(1, "Paragraf penutup wajib diisi"),
  signature: z.string().optional(),
  language: z.enum(["en", "id"]),
});

export type ApplicationLetterFormData = z.infer<typeof applicationLetterSchema>;

interface ApplicationLetterFormProps {
  initialData?: Partial<ApplicationLetter>;
  onSubmit: (data: ApplicationLetterFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApplicationLetterForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ApplicationLetterFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialData?.template_id || ""
  );

  const form = useForm<ApplicationLetterFormData>({
    resolver: zodResolver(applicationLetterSchema),
    defaultValues: {
      template_id: initialData?.template_id || "",
      name: initialData?.name || "",
      birth_place_date: initialData?.birth_place_date || "",
      gender: initialData?.gender || "male",
      marital_status: initialData?.marital_status || "single",
      education: initialData?.education || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      subject: initialData?.subject || "",
      applicant_city: initialData?.applicant_city || "",
      application_date: initialData?.application_date || "",
      receiver_title: initialData?.receiver_title || "",
      company_name: initialData?.company_name || "",
      company_city: initialData?.company_city || "",
      company_address: initialData?.company_address || "",
      opening_paragraph: initialData?.opening_paragraph || "",
      body_paragraph: initialData?.body_paragraph || "",
      attachments: initialData?.attachments || "",
      closing_paragraph: initialData?.closing_paragraph || "",
      signature: initialData?.signature || "",
      language: initialData?.language || "id",
    },
  });

  // Handle form validation errors from API
  useFormErrors(form);

  // Fetch templates based on selected language
  const { data: templatesResponse, isLoading: isTemplatesLoading } =
    useTemplates({
      params: {
        type: "application_letter",
        language: form.watch("language"),
      },
    });

  const templates =
    templatesResponse?.items.map((t) => ({
      id: t.id,
      name: t.name,
      previewImage: buildImageUrl(t.preview),
    })) || [];

  // Set default template when data is loaded
  useEffect(() => {
    if (!form.getValues("template_id") && templates.length > 0) {
      const defaultTemplateId = templates[0].id;
      setSelectedTemplate(defaultTemplateId);
      form.setValue("template_id", defaultTemplateId);
    }
  }, [templates, form]);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [activeParagraphType, setActiveParagraphType] =
    useState<ParagraphType | null>(null);

  const handleOpenTemplateModal = (type: ParagraphType) => {
    setActiveParagraphType(type);
    setTemplateModalOpen(true);
  };

  const handleSelectTemplate = (content: string) => {
    if (activeParagraphType === "opening") {
      form.setValue("opening_paragraph", content);
    } else if (activeParagraphType === "body") {
      form.setValue("body_paragraph", content);
    } else if (activeParagraphType === "closing") {
      form.setValue("closing_paragraph", content);
    }
  };

  const getCurrentParagraphValue = () => {
    if (activeParagraphType === "opening")
      return form.watch("opening_paragraph");
    if (activeParagraphType === "body") return form.watch("body_paragraph");
    if (activeParagraphType === "closing")
      return form.watch("closing_paragraph");
    return "";
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Template Selection */}
        <Card className="p-6">
          <FieldSet>
            <FieldLegend>Template Surat</FieldLegend>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Controller
                  control={form.control}
                  name="language"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Bahasa *</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id={field.name}>
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
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </div>

              <div className="md:col-span-3">
                {isTemplatesLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-sm text-muted-foreground">
                      Memuat templates...
                    </div>
                  </div>
                ) : (
                  <TemplateSelector
                    label="Pilih Template"
                    templates={templates}
                    value={selectedTemplate}
                    onChange={(value: string) => {
                      setSelectedTemplate(value);
                      form.setValue("template_id", value);
                    }}
                  />
                )}
              </div>
            </div>
          </FieldSet>
        </Card>

        <Card className="p-6 mb-6">
          <FieldSet>
            <FieldLegend>Informasi Pelamar</FieldLegend>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Nama Lengkap *</FieldLabel>
                    <Input id={field.name} {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="birth_place_date"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Tempat, Tanggal Lahir *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Jakarta, 15 Mei 1995"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Jenis Kelamin *
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="marital_status"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Status Pernikahan *
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {MARITAL_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="education"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Pendidikan Terakhir *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="S1 Teknik Informatika"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Nomor Telepon *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="081234567890"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email *</FieldLabel>
                    <Input id={field.name} {...field} type="email" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="applicant_city"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Kota Pelamar *</FieldLabel>
                    <Input id={field.name} {...field} placeholder="Jakarta" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <div className="md:col-span-2">
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Alamat Lengkap *
                      </FieldLabel>
                      <Textarea id={field.name} {...field} rows={2} />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </Card>

        <Card className="p-6 mb-6">
          <FieldSet>
            <FieldLegend>Informasi Perusahaan</FieldLegend>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="receiver_title"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Jabatan Penerima *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="HRD Manager"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="company_name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Nama Perusahaan *
                    </FieldLabel>
                    <Input id={field.name} {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="company_city"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Kota Perusahaan *
                    </FieldLabel>
                    <Input id={field.name} {...field} placeholder="Jakarta" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="application_date"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Tanggal Lamaran *
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id={field.name}
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
                            field.value ? new Date(field.value) : undefined
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
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <div className="md:col-span-2">
                <Controller
                  control={form.control}
                  name="company_address"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Alamat Perusahaan *
                      </FieldLabel>
                      <Textarea id={field.name} {...field} rows={2} />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </Card>

        <Card className="p-6 mb-6">
          <FieldSet>
            <FieldLegend>Isi Surat</FieldLegend>
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Controller
                  control={form.control}
                  name="subject"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Subjek Surat *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="Lamaran Posisi Software Engineer"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={form.control}
                name="opening_paragraph"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        Paragraf Pembuka *
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTemplateModal("opening")}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Gunakan Template
                      </Button>
                    </div>
                    <Textarea
                      id={field.name}
                      {...field}
                      rows={3}
                      placeholder="Dengan hormat, saya yang bertanda tangan di bawah ini..."
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="body_paragraph"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        Paragraf Isi *
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTemplateModal("body")}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Gunakan Template
                      </Button>
                    </div>
                    <Textarea
                      id={field.name}
                      {...field}
                      rows={5}
                      placeholder="Saya memiliki pengalaman dalam bidang..."
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="attachments"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Lampiran</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="CV, Ijazah, Transkrip Nilai, Sertifikat"
                    />
                    <FieldDescription>
                      Pisahkan setiap item lampiran dengan tanda koma (,)
                    </FieldDescription>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="closing_paragraph"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        Paragraf Penutup *
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTemplateModal("closing")}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Gunakan Template
                      </Button>
                    </div>
                    <Textarea
                      id={field.name}
                      {...field}
                      rows={3}
                      placeholder="Demikian surat lamaran ini saya buat..."
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <div className="space-y-3">
                <FieldLabel>Tanda Tangan</FieldLabel>
                <SignatureUpload
                  value={form.watch("signature") || ""}
                  onChange={(value) => form.setValue("signature", value)}
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </Card>

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

      <ParagraphTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        paragraphType={activeParagraphType}
        currentValue={getCurrentParagraphValue()}
        onSelectTemplate={handleSelectTemplate}
        language={form.watch("language")}
      />
    </>
  );
}
