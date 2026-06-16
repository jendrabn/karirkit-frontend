import { useMemo } from "react";
import { useForm, Controller, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSet,
} from "@/components/ui/field";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  type Job,
} from "@/types/job";
import { QuillEditor } from "@/features/admin/jobs/components/quill-editor";
import {
  createJobInputSchema,
  type CreateJobInput,
} from "../api/create-job";
import {
  updateJobInputSchema,
  type UpdateJobInput,
} from "../api/update-job";
import { useCompaniesList, useJobRolesList, useCitiesList } from "@/lib/jobs";
import { JobMediasUpload } from "./job-medias-upload";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";
import { cn } from "@/lib/utils";
import { dayjs } from "@/lib/date";

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: CreateJobInput | UpdateJobInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: unknown;
}

type JobFormInput = z.input<typeof createJobInputSchema>;
type JobFormValues = z.output<typeof createJobInputSchema>;

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";

  const parsedValue = dayjs(value);
  return parsedValue.isValid() ? parsedValue.format("YYYY-MM-DD") : "";
};

const ensureSelectedItemExists = (
  items: string[] | undefined,
  selectedValue?: string | null,
) => {
  if (!selectedValue) {
    return items ?? [];
  }

  return Array.from(new Set([...(items ?? []), selectedValue]));
};

const getDefaultValues = (initialData?: Job): DefaultValues<JobFormInput> => {
  if (initialData) {
    return {
      company_id: initialData.company_id,
      job_role_id: initialData.job_role_id,
      city_id: initialData.city_id,
      title: initialData.title,
      job_type: initialData.job_type,
      work_system: initialData.work_system,
      education_level: initialData.education_level,
      min_years_of_experience: initialData.min_years_of_experience,
      max_years_of_experience: initialData.max_years_of_experience ?? null,
      description: initialData.description,
      requirements: initialData.requirements,
      salary_min: initialData.salary_min ?? null,
      salary_max: initialData.salary_max ?? null,
      talent_quota: initialData.talent_quota ?? null,
      job_url: initialData.job_url,
      contact_name: initialData.contact_name,
      contact_email: initialData.contact_email,
      contact_phone: initialData.contact_phone,
      medias: initialData.medias?.map((media) => ({ path: media.path })) || [],
      status: initialData.status,
      expiration_date: toDateInputValue(initialData.expiration_date),
    };
  }

  return {
    title: "",
    company_id: "",
    job_role_id: "",
    city_id: "",
    min_years_of_experience: 0,
    max_years_of_experience: null,
    description: "",
    requirements: "",
    salary_min: null,
    salary_max: null,
    talent_quota: null,
    job_url: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    medias: [],
    status: undefined,
    expiration_date: undefined,
  };
};

export function JobForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: JobFormProps) {
  const isEdit = !!initialData;

  const { data: companiesData } = useCompaniesList();
  const { data: rolesData } = useJobRolesList();
  const { data: citiesData } = useCitiesList({ has_jobs: false });

  const companyLabelById = useMemo(
    () => new Map(companiesData?.map((company) => [company.id, company.name])),
    [companiesData],
  );
  const roleLabelById = useMemo(
    () => new Map(rolesData?.map((role) => [role.id, role.name])),
    [rolesData],
  );
  const cityLabelById = useMemo(
    () => new Map(citiesData?.map((city) => [city.id, city.name])),
    [citiesData],
  );

  const form = useForm<JobFormInput, unknown, JobFormValues>({
    resolver: zodResolver(
      isEdit ? updateJobInputSchema : createJobInputSchema,
    ),
    defaultValues: getDefaultValues(initialData),
  });

  useServerValidation(error, form);

  const handleSubmit = (values: JobFormValues) => {
    onSubmit({
      ...values,
      expiration_date: values.expiration_date || null,
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit, displayFormErrors)}
      className="flex flex-col gap-6"
    >
      <FieldSet disabled={isLoading} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/*  Informasi Dasar  */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <FieldGroup className="grid gap-4">
              <Field>
                <FieldLabel>
                  Judul Lowongan <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Contoh: Senior Frontend Developer"
                  {...form.register("title")}
                  className={cn(
                    form.formState.errors.title && "border-destructive",
                  )}
                />
                <FieldError>{form.formState.errors.title?.message}</FieldError>
              </Field>

              <Controller
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Perusahaan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Combobox
                      key={`${field.value ?? "empty"}-${companiesData?.length ?? 0}`}
                      items={ensureSelectedItemExists(
                        companiesData?.map((company) => company.id),
                        field.value,
                      )}
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      itemToStringLabel={(value) =>
                        companyLabelById.get(value as string) ??
                        (value === initialData?.company_id
                          ? initialData.company?.name ?? ""
                          : "")
                      }
                    >
                      <ComboboxInput
                        className={cn(
                          "w-full",
                          form.formState.errors.company_id &&
                            "border-destructive",
                        )}
                        placeholder="Contoh: PT Nusantara Digital Solusi"
                        aria-invalid={!!form.formState.errors.company_id}
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>
                          Perusahaan tidak ditemukan
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(companyId) => (
                            <ComboboxItem key={companyId} value={companyId}>
                              {companyLabelById.get(companyId) ?? ""}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError>
                      {form.formState.errors.company_id?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="job_role_id"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Role Pekerjaan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Combobox
                      key={`${field.value ?? "empty"}-${rolesData?.length ?? 0}`}
                      items={ensureSelectedItemExists(
                        rolesData?.map((role) => role.id),
                        field.value,
                      )}
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      itemToStringLabel={(value) =>
                        roleLabelById.get(value as string) ??
                        (value === initialData?.job_role_id
                          ? initialData.job_role?.name ?? ""
                          : "")
                      }
                    >
                    <ComboboxInput
                        className={cn(
                          "w-full",
                          form.formState.errors.job_role_id &&
                            "border-destructive",
                        )}
                        placeholder="Contoh: Frontend Developer"
                        aria-invalid={!!form.formState.errors.job_role_id}
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>Role tidak ditemukan</ComboboxEmpty>
                        <ComboboxList>
                          {(roleId) => (
                            <ComboboxItem key={roleId} value={roleId}>
                              {roleLabelById.get(roleId) ?? ""}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError>
                      {form.formState.errors.job_role_id?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Kota</FieldLabel>
                    <Combobox
                      key={`${field.value ?? "empty"}-${citiesData?.length ?? 0}`}
                      items={ensureSelectedItemExists(
                        citiesData?.map((city) => city.id),
                        field.value,
                      )}
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      itemToStringLabel={(value) =>
                        cityLabelById.get(value as string) ??
                        (value === initialData?.city_id
                          ? initialData.city?.name ?? ""
                          : "")
                      }
                    >
                      <ComboboxInput
                        className={cn(
                          "w-full",
                          form.formState.errors.city_id && "border-destructive",
                        )}
                        placeholder="Contoh: Jakarta"
                        aria-invalid={!!form.formState.errors.city_id}
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>Kota tidak ditemukan</ComboboxEmpty>
                        <ComboboxList>
                          {(cityId) => (
                            <ComboboxItem key={cityId} value={cityId}>
                              {cityLabelById.get(cityId) ?? ""}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError>
                      {form.formState.errors.city_id?.message}
                    </FieldError>
                    </Field>
                  )}
              />
              </FieldGroup>

              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="job_type"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>
                        Tipe Pekerjaan{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
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
                        <SelectContent>
                          {Object.entries(JOB_TYPE_LABELS).map(([v, l]) => (
                            <SelectItem key={v} value={v}>
                              {l}
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
                      <FieldLabel>
                        Sistem Kerja <span className="text-destructive">*</span>
                      </FieldLabel>
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
                        <SelectContent>
                          {Object.entries(WORK_SYSTEM_LABELS).map(([v, l]) => (
                            <SelectItem key={v} value={v}>
                              {l}
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
              </FieldGroup>

              <Controller
                control={form.control}
                name="education_level"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Pendidikan Minimal{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.education_level &&
                            "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Pendidikan Minimal" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EDUCATION_LEVEL_LABELS).map(
                          ([v, l]) => (
                            <SelectItem key={v} value={v}>
                              {l}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.education_level?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>
                    Pengalaman Minimal (Tahun){" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 2"
                    {...form.register("min_years_of_experience", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                    className={cn(
                      form.formState.errors.min_years_of_experience &&
                        "border-destructive",
                    )}
                  />
                  <FieldError>
                    {form.formState.errors.min_years_of_experience?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Pengalaman Maksimal (Tahun)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 5"
                    {...form.register("max_years_of_experience", {
                      setValueAs: (value) =>
                        value === "" ? null : Number(value),
                    })}
                    className={cn(
                      form.formState.errors.max_years_of_experience &&
                        "border-destructive",
                    )}
                  />
                  <FieldError>
                    {form.formState.errors.max_years_of_experience?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/*  Gaji & Kontak  */}
          <Card>
            <CardHeader>
              <CardTitle>Gaji & Kontak</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Gaji Minimum</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 8.000.000"
                    {...form.register("salary_min", {
                      setValueAs: (value) =>
                        value === "" ? null : Number(value),
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
                  <FieldLabel>Gaji Maksimum</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 12.000.000"
                    {...form.register("salary_max", {
                      setValueAs: (value) =>
                        value === "" ? null : Number(value),
                    })}
                    className={cn(
                      form.formState.errors.salary_max && "border-destructive",
                    )}
                  />
                  <FieldError>
                    {form.formState.errors.salary_max?.message}
                  </FieldError>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel>Kuota Talenta</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Contoh: 3"
                  {...form.register("talent_quota", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                  className={cn(
                    form.formState.errors.talent_quota &&
                      "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.talent_quota?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>URL Lowongan</FieldLabel>
                <Input
                  placeholder="Contoh: https://career.company.com/frontend-developer"
                  {...form.register("job_url")}
                  className={cn(
                    form.formState.errors.job_url && "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.job_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Nama Kontak</FieldLabel>
                <Input
                  placeholder="Contoh: Siti Aulia, Recruiter"
                  {...form.register("contact_name")}
                  className={cn(
                    form.formState.errors.contact_name &&
                      "border-destructive",
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
                  placeholder="Contoh: hr@perusahaan.id"
                  {...form.register("contact_email")}
                  className={cn(
                    form.formState.errors.contact_email &&
                      "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.contact_email?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Telepon Kontak</FieldLabel>
                <Input
                  placeholder="Contoh: 08123456xxxxx"
                  {...form.register("contact_phone")}
                  className={cn(
                    form.formState.errors.contact_phone &&
                      "border-destructive",
                  )}
                />
                <FieldError>
                  {form.formState.errors.contact_phone?.message}
                </FieldError>
              </Field>

              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Status Lowongan{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger
                        className={cn(
                          form.formState.errors.status && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih Status Lowongan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
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
                name="expiration_date"
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.expiration_date}>
                    <FieldLabel>Tanggal Kadaluarsa</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            form.formState.errors.expiration_date &&
                              "border-destructive",
                          )}
                          aria-invalid={
                            !!form.formState.errors.expiration_date
                          }
                        >
                          <CalendarIcon data-icon="inline-start" />
                          {field.value
                            ? dayjs(field.value).format("DD MMMM YYYY")
                            : "Pilih Tanggal Kadaluarsa"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? dayjs(field.value).toDate() : undefined
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
                      {form.formState.errors.expiration_date?.message}
                    </FieldError>
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/*  Media Poster  */}
        <Card>
          <CardHeader>
            <CardTitle>Media Poster</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="medias"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Media Lowongan</FieldLabel>
                  <JobMediasUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError>
                    {typeof form.formState.errors.medias?.message === "string"
                      ? form.formState.errors.medias?.message
                      : undefined}
                  </FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/*  Deskripsi & Persyaratan  */}
        <Card>
          <CardHeader>
            <CardTitle>Deskripsi & Persyaratan</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    Deskripsi Pekerjaan{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <QuillEditor
                    key="description-editor"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Contoh: Bertanggung jawab mengembangkan fitur antarmuka, berkolaborasi dengan tim produk, dan menjaga kualitas kode."
                  />
                  <FieldError>
                    {form.formState.errors.description?.message}
                  </FieldError>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    Persyaratan <span className="text-destructive">*</span>
                  </FieldLabel>
                  <QuillEditor
                    key="requirements-editor"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Contoh: Menguasai React, TypeScript, dan memiliki pengalaman minimal 2 tahun di pengembangan web."
                  />
                  <FieldError>
                    {form.formState.errors.requirements?.message}
                  </FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>
      </FieldSet>

      {/*  Actions  */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
