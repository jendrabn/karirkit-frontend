import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import {
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  EDUCATION_LEVEL_LABELS,
  type Job,
} from "@/types/job";
import { QuillEditor } from "@/features/admin/jobs/components/QuillEditor";
import { createJobInputSchema, type CreateJobInput } from "../api/create-job";
import { updateJobInputSchema, type UpdateJobInput } from "../api/update-job";
import { useCompaniesList, useJobRolesList, useCitiesList } from "@/lib/jobs";
import { JobMediasUpload } from "./JobMediasUpload";
import { useServerValidation } from "@/hooks/use-server-validation";

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: CreateJobInput | UpdateJobInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: unknown;
}

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

  const form = useForm<CreateJobInput | UpdateJobInput>({
    resolver: zodResolver(isEdit ? updateJobInputSchema : createJobInputSchema),
    defaultValues: initialData
      ? {
          company_id: initialData.company_id,
          job_role_id: initialData.job_role_id,
          city_id: initialData.city_id,
          title: initialData.title,
          job_type: initialData.job_type,
          work_system: initialData.work_system,
          education_level: initialData.education_level,
          min_years_of_experience: initialData.min_years_of_experience,
          max_years_of_experience: initialData.max_years_of_experience,
          description: initialData.description,
          requirements: initialData.requirements,
          salary_min: initialData.salary_min,
          salary_max: initialData.salary_max,
          talent_quota: initialData.talent_quota,
          job_url: initialData.job_url,
          contact_name: initialData.contact_name,
          contact_email: initialData.contact_email,
          contact_phone: initialData.contact_phone,
          medias:
            initialData.medias?.map((media) => ({ path: media.path })) || [],
          status: initialData.status as any,
          expiration_date: initialData.expiration_date,
        }
      : {
          title: "",
          company_id: "",
          job_role_id: "",
          city_id: "",
          job_type: "full_time",
          work_system: "onsite",
          education_level: "any",
          min_years_of_experience: 0,
          max_years_of_experience: null,
          description: "",
          requirements: "",
          salary_min: 0,
          salary_max: 0,
          talent_quota: 1,
          job_url: "",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          medias: [],
          status: "draft",
          expiration_date: null,
        },
  });

  // Note: This form doesn't have direct access to mutation error
  // If this form is used in a context with a mutation, pass the error prop
  useServerValidation(error, form);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldSet disabled={isLoading} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ================= Informasi Dasar ================= */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Judul Lowongan *</FieldLabel>
                <Input
                  placeholder="Contoh: Senior Frontend Developer"
                  {...form.register("title")}
                />
                <FieldError>{form.formState.errors.title?.message}</FieldError>
              </Field>

              <Controller
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Perusahaan *</FieldLabel>
                    <Combobox
                      options={
                        companiesData?.map((c) => ({
                          value: c.id,
                          label: c.name,
                        })) || []
                      }
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Pilih perusahaan tempat lowongan ini dibuka"
                      searchPlaceholder="Ketik nama perusahaan..."
                      emptyText="Perusahaan tidak ditemukan"
                    />
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
                    <FieldLabel>Role Pekerjaan *</FieldLabel>
                    <Combobox
                      options={
                        rolesData?.map((r) => ({
                          value: r.id,
                          label: r.name,
                        })) || []
                      }
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                      placeholder="Pilih role atau posisi pekerjaan"
                      searchPlaceholder="Cari role pekerjaan..."
                      emptyText="Role tidak ditemukan"
                    />
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
                    <FieldLabel>Kota *</FieldLabel>
                    <Combobox
                      options={
                        citiesData?.map((c) => ({
                          value: c.id,
                          label: c.name,
                        })) || []
                      }
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                      placeholder="Pilih lokasi penempatan kerja"
                      searchPlaceholder="Cari nama kota..."
                      emptyText="Kota tidak ditemukan"
                    />
                    <FieldError>
                      {form.formState.errors.city_id?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="job_type"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Tipe Pekerjaan *</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Full-time / Internship / Freelance" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
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
                      <FieldLabel>Sistem Kerja *</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Onsite / Hybrid / Remote" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
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
              </div>

              <Controller
                control={form.control}
                name="education_level"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Pendidikan Minimal *</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pendidikan minimal" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {Object.entries(EDUCATION_LEVEL_LABELS).map(
                          ([v, l]) => (
                            <SelectItem key={v} value={v}>
                              {l}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FieldError>
                      {form.formState.errors.education_level?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Pengalaman Minimal (Tahun) *</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 2"
                    {...form.register("min_years_of_experience", {
                      valueAsNumber: true,
                    })}
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
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError>
                    {form.formState.errors.max_years_of_experience?.message}
                  </FieldError>
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* ================= Gaji & Kontak ================= */}
          <Card>
            <CardHeader>
              <CardTitle>Gaji & Kontak</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Gaji Minimum *</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 8000000"
                    {...form.register("salary_min", { valueAsNumber: true })}
                  />
                  <FieldError>
                    {form.formState.errors.salary_min?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Gaji Maksimum *</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Contoh: 12000000"
                    {...form.register("salary_max", { valueAsNumber: true })}
                  />
                  <FieldError>
                    {form.formState.errors.salary_max?.message}
                  </FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel>Kuota Talenta *</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 3"
                  {...form.register("talent_quota", { valueAsNumber: true })}
                />
                <FieldError>
                  {form.formState.errors.talent_quota?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>URL Lowongan</FieldLabel>
                <Input
                  placeholder="https://career.company.com/frontend-developer"
                  {...form.register("job_url")}
                />
                <FieldError>
                  {form.formState.errors.job_url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Nama Kontak *</FieldLabel>
                <Input
                  placeholder="Nama HR atau Recruiter"
                  {...form.register("contact_name")}
                />
                <FieldError>
                  {form.formState.errors.contact_name?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Email Kontak *</FieldLabel>
                <Input
                  type="email"
                  placeholder="hr@company.com"
                  {...form.register("contact_email")}
                />
                <FieldError>
                  {form.formState.errors.contact_email?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Telepon Kontak *</FieldLabel>
                <Input
                  placeholder="+62 812 3456 7890"
                  {...form.register("contact_phone")}
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
                    <FieldLabel>Status Lowongan *</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status publikasi" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
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
            </CardContent>
          </Card>
        </div>

        {/* ================= Media Poster ================= */}
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

        {/* ================= Deskripsi & Persyaratan ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Deskripsi & Persyaratan</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Deskripsi Pekerjaan *</FieldLabel>
                  <QuillEditor
                    key="description-editor"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Jelaskan tanggung jawab pekerjaan, lingkup kerja, dan ekspektasi kandidat"
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
                  <FieldLabel>Persyaratan *</FieldLabel>
                  <QuillEditor
                    key="requirements-editor"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Tuliskan kualifikasi, skill, dan pengalaman yang dibutuhkan"
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

      {/* ================= Actions ================= */}
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
            : "Terbitkan Lowongan"}
        </Button>
      </div>
    </form>
  );
}
