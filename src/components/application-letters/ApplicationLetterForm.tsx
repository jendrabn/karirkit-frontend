import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, FileText } from "lucide-react";
import { ParagraphTemplateModal } from "./ParagraphTemplateModal";
import { ParagraphType } from "@/data/paragraphTemplates";
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
import { SignatureUpload } from "./SignatureUpload";
import { TemplateSelector } from "@/components/ui/template-selector";
import { applicationLetterTemplates } from "@/data/documentTemplates";
import {
  ApplicationLetter,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/applicationLetter";

const applicationLetterSchema = z.object({
  template_id: z.string().optional(),
  name: z.string().min(1, "Nama wajib diisi"),
  birth_place_date: z.string().min(1, "Tempat/tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"]),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  education: z.string().min(1, "Pendidikan wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid"),
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
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.template_id || applicationLetterTemplates[0]?.id || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationLetterFormData>({
    resolver: zodResolver(applicationLetterSchema),
    defaultValues: {
      template_id: initialData?.template_id || applicationLetterTemplates[0]?.id || "",
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

  const applicationDateValue = watch("application_date");
  const signatureValue = watch("signature");
  const openingParagraphValue = watch("opening_paragraph");
  const bodyParagraphValue = watch("body_paragraph");
  const closingParagraphValue = watch("closing_paragraph");

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [activeParagraphType, setActiveParagraphType] = useState<ParagraphType | null>(null);

  const handleOpenTemplateModal = (type: ParagraphType) => {
    setActiveParagraphType(type);
    setTemplateModalOpen(true);
  };

  const handleSelectTemplate = (content: string) => {
    if (activeParagraphType === "opening") {
      setValue("opening_paragraph", content);
    } else if (activeParagraphType === "body") {
      setValue("body_paragraph", content);
    } else if (activeParagraphType === "closing") {
      setValue("closing_paragraph", content);
    }
  };

  const getCurrentParagraphValue = () => {
    if (activeParagraphType === "opening") return openingParagraphValue;
    if (activeParagraphType === "body") return bodyParagraphValue;
    if (activeParagraphType === "closing") return closingParagraphValue;
    return "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Template Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Template Surat</h3>
        <TemplateSelector
          label="Pilih Template"
          templates={applicationLetterTemplates}
          value={selectedTemplate}
          onChange={(value) => {
            setSelectedTemplate(value);
            setValue("template_id", value);
          }}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informasi Pelamar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="birth_place_date">Tempat, Tanggal Lahir *</Label>
            <Input
              id="birth_place_date"
              {...register("birth_place_date")}
              placeholder="Jakarta, 15 Mei 1995"
              className={cn(errors.birth_place_date && "border-destructive")}
            />
            <FormError message={errors.birth_place_date?.message} />
          </div>

          <div className="space-y-2">
            <Label>Jenis Kelamin *</Label>
            <Select
              value={watch("gender")}
              onValueChange={(value) => setValue("gender", value as any)}
            >
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label>Status Pernikahan *</Label>
            <Select
              value={watch("marital_status")}
              onValueChange={(value) => setValue("marital_status", value as any)}
            >
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Pendidikan Terakhir *</Label>
            <Input
              id="education"
              {...register("education")}
              placeholder="S1 Teknik Informatika"
              className={cn(errors.education && "border-destructive")}
            />
            <FormError message={errors.education?.message} />
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
            <Label htmlFor="applicant_city">Kota Pelamar *</Label>
            <Input
              id="applicant_city"
              {...register("applicant_city")}
              placeholder="Jakarta"
              className={cn(errors.applicant_city && "border-destructive")}
            />
            <FormError message={errors.applicant_city?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Alamat Lengkap *</Label>
            <Textarea
              id="address"
              {...register("address")}
              rows={2}
              className={cn(errors.address && "border-destructive")}
            />
            <FormError message={errors.address?.message} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informasi Perusahaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="receiver_title">Jabatan Penerima *</Label>
            <Input
              id="receiver_title"
              {...register("receiver_title")}
              placeholder="HRD Manager"
              className={cn(errors.receiver_title && "border-destructive")}
            />
            <FormError message={errors.receiver_title?.message} />
          </div>

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
            <Label htmlFor="company_city">Kota Perusahaan *</Label>
            <Input
              id="company_city"
              {...register("company_city")}
              placeholder="Jakarta"
              className={cn(errors.company_city && "border-destructive")}
            />
            <FormError message={errors.company_city?.message} />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Lamaran *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !applicationDateValue && "text-muted-foreground",
                    errors.application_date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {applicationDateValue ? format(new Date(applicationDateValue), "dd/MM/yyyy") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={applicationDateValue ? new Date(applicationDateValue) : undefined}
                  onSelect={(date) => setValue("application_date", date ? format(date, "yyyy-MM-dd") : "")}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormError message={errors.application_date?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="company_address">Alamat Perusahaan *</Label>
            <Textarea
              id="company_address"
              {...register("company_address")}
              rows={2}
              className={cn(errors.company_address && "border-destructive")}
            />
            <FormError message={errors.company_address?.message} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Isi Surat</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subjek Surat *</Label>
              <Input
                id="subject"
                {...register("subject")}
                placeholder="Lamaran Posisi Software Engineer"
                className={cn(errors.subject && "border-destructive")}
              />
              <FormError message={errors.subject?.message} />
            </div>

            <div className="space-y-2">
              <Label>Bahasa *</Label>
              <Select
                value={watch("language")}
                onValueChange={(value) => setValue("language", value as any)}
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
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opening_paragraph">Paragraf Pembuka *</Label>
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
              {...register("opening_paragraph")}
              rows={3}
              placeholder="Dengan hormat, saya yang bertanda tangan di bawah ini..."
              className={cn(errors.opening_paragraph && "border-destructive")}
            />
            <FormError message={errors.opening_paragraph?.message} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body_paragraph">Paragraf Isi *</Label>
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
              {...register("body_paragraph")}
              rows={5}
              placeholder="Saya memiliki pengalaman dalam bidang..."
              className={cn(errors.body_paragraph && "border-destructive")}
            />
            <FormError message={errors.body_paragraph?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Lampiran</Label>
            <Input
              id="attachments"
              {...register("attachments")}
              placeholder="CV, Ijazah, Transkrip Nilai, Sertifikat"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="closing_paragraph">Paragraf Penutup *</Label>
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
              {...register("closing_paragraph")}
              rows={3}
              placeholder="Demikian surat lamaran ini saya buat..."
              className={cn(errors.closing_paragraph && "border-destructive")}
            />
            <FormError message={errors.closing_paragraph?.message} />
          </div>

          <SignatureUpload
            value={signatureValue || ""}
            onChange={(value) => setValue("signature", value)}
          />
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

      <ParagraphTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        paragraphType={activeParagraphType}
        currentValue={getCurrentParagraphValue()}
        onSelectTemplate={handleSelectTemplate}
      />
    </form>
  );
}
