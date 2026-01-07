/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dayjs } from "@/lib/date";
import { CalendarIcon, FileText } from "lucide-react";
import { ParagraphTemplateModal } from "./ParagraphTemplateModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ParagraphType } from "@/types/template";
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
import { cn, buildImageUrl } from "@/lib/utils";
import {
  Field,
  FieldGroup,
  FieldLabel,
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
import {
  applicationLetterSchema,
  type ApplicationLetterFormData,
} from "../api/create-application-letter";

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
      ...t,
      previewImage: buildImageUrl(t.preview),
    })) || [];

  // Set default template when data is loaded
  useEffect(() => {
    if (!form.getValues("template_id") && templates.length > 0) {
      const defaultTemplateId = templates[0].id;
      setSelectedTemplate(defaultTemplateId);
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
        <FieldSet>
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Template Surat</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <Controller
                    control={form.control}
                    name="language"
                    render={({ field }) => (
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
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError>
                          {form.formState.errors.language?.message}
                        </FieldError>
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
                  <FieldError>
                    {form.formState.errors.template_id?.message}
                  </FieldError>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicant Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informasi Pelamar</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="name">Nama Lengkap *</FieldLabel>
                  <Input id="name" {...form.register("name")} />
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="birth_place_date">
                    Tempat, Tanggal Lahir *
                  </FieldLabel>
                  <Input
                    id="birth_place_date"
                    {...form.register("birth_place_date")}
                    placeholder="Jakarta, 15 Mei 1995"
                  />
                  <FieldError>
                    {form.formState.errors.birth_place_date?.message}
                  </FieldError>
                </Field>

                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
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
                      <FieldError>
                        {form.formState.errors.gender?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="marital_status"
                  render={({ field }) => (
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
                      <FieldError>
                        {form.formState.errors.marital_status?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel htmlFor="education">
                    Pendidikan Terakhir *
                  </FieldLabel>
                  <Input
                    id="education"
                    {...form.register("education")}
                    placeholder="S1 Teknik Informatika"
                  />
                  <FieldError>
                    {form.formState.errors.education?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Nomor Telepon *</FieldLabel>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="081234567890"
                  />
                  <FieldError>
                    {form.formState.errors.phone?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input type="email" id="email" {...form.register("email")} />
                  <FieldError>
                    {form.formState.errors.email?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="applicant_city">
                    Kota Pelamar *
                  </FieldLabel>
                  <Input
                    id="applicant_city"
                    {...form.register("applicant_city")}
                    placeholder="Jakarta"
                  />
                  <FieldError>
                    {form.formState.errors.applicant_city?.message}
                  </FieldError>
                </Field>

                <div className="md:col-span-2">
                  <Field>
                    <FieldLabel htmlFor="address">Alamat Lengkap *</FieldLabel>
                    <Textarea
                      id="address"
                      {...form.register("address")}
                      rows={2}
                    />
                    <FieldError>
                      {form.formState.errors.address?.message}
                    </FieldError>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informasi Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="receiver_title">
                    Jabatan Penerima *
                  </FieldLabel>
                  <Input
                    id="receiver_title"
                    {...form.register("receiver_title")}
                    placeholder="HRD Manager"
                  />
                  <FieldError>
                    {form.formState.errors.receiver_title?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="company_name">
                    Nama Perusahaan *
                  </FieldLabel>
                  <Input id="company_name" {...form.register("company_name")} />
                  <FieldError>
                    {form.formState.errors.company_name?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="company_city">
                    Kota Perusahaan *
                  </FieldLabel>
                  <Input
                    id="company_city"
                    {...form.register("company_city")}
                    placeholder="Jakarta"
                  />
                  <FieldError>
                    {form.formState.errors.company_city?.message}
                  </FieldError>
                </Field>

                <Controller
                  control={form.control}
                  name="application_date"
                  render={({ field }) => (
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
                        <PopoverContent
                          className="w-auto p-0 z-50"
                          align="start"
                        >
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
                      <FieldError>
                        {form.formState.errors.application_date?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <div className="md:col-span-2">
                  <Field>
                    <FieldLabel htmlFor="company_address">
                      Alamat Perusahaan *
                    </FieldLabel>
                    <Textarea
                      id="company_address"
                      {...form.register("company_address")}
                      rows={2}
                    />
                    <FieldError>
                      {form.formState.errors.company_address?.message}
                    </FieldError>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Letter Body */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Isi Surat</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Field>
                    <FieldLabel htmlFor="subject">Subjek Surat *</FieldLabel>
                    <Input
                      id="subject"
                      {...form.register("subject")}
                      placeholder="Lamaran Posisi Software Engineer"
                    />
                    <FieldError>
                      {form.formState.errors.subject?.message}
                    </FieldError>
                  </Field>
                </div>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="opening_paragraph">
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
                    id="opening_paragraph"
                    {...form.register("opening_paragraph")}
                    rows={3}
                    placeholder="Dengan hormat, saya yang bertanda tangan di bawah ini..."
                  />
                  <FieldError>
                    {form.formState.errors.opening_paragraph?.message}
                  </FieldError>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="body_paragraph">
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
                    id="body_paragraph"
                    {...form.register("body_paragraph")}
                    rows={5}
                    placeholder="Saya memiliki pengalaman dalam bidang..."
                  />
                  <FieldError>
                    {form.formState.errors.body_paragraph?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="attachments">Lampiran</FieldLabel>
                  <Input
                    id="attachments"
                    {...form.register("attachments")}
                    placeholder="CV, Ijazah, Transkrip Nilai, Sertifikat"
                  />
                  <FieldDescription>
                    Pisahkan setiap item lampiran dengan tanda koma (,)
                  </FieldDescription>
                  <FieldError>
                    {form.formState.errors.attachments?.message}
                  </FieldError>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="closing_paragraph">
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
                    id="closing_paragraph"
                    {...form.register("closing_paragraph")}
                    rows={3}
                    placeholder="Demikian surat lamaran ini saya buat..."
                  />
                  <FieldError>
                    {form.formState.errors.closing_paragraph?.message}
                  </FieldError>
                </Field>

                <div className="space-y-3">
                  <FieldLabel>Tanda Tangan</FieldLabel>
                  <SignatureUpload
                    value={form.watch("signature") || ""}
                    onChange={(value) => form.setValue("signature", value)}
                  />
                  <FieldError>
                    {form.formState.errors.signature?.message}
                  </FieldError>
                </div>
              </FieldGroup>
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
