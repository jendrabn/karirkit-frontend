import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Share2, Trash2 } from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { cn } from "@/lib/utils";

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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { dayjs } from "@/lib/date";
import {
  updateProfileInputSchema,
  useUpdateProfile,
} from "@/features/account/api/update-profile";
import { useAuth } from "@/contexts/AuthContext";
import { useServerValidation } from "@/hooks/use-server-validation";
import { displayFormErrors } from "@/lib/form-errors";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SOCIAL_PLATFORM_OPTIONS } from "@/types/social";
import type { SocialLink } from "@/types/social";

const genderOptions = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
] as const;

type ProfileFormData = z.infer<typeof updateProfileInputSchema>;

const ProfileForm = () => {
  const { user } = useAuth();

  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Profil berhasil diperbarui");
      },
      onError: (error) => {
        console.error("Error: ", error);
      },
    },
  });

  const form = useForm<ProfileFormData>({
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
      headline: user?.headline || "",
      bio: user?.bio || "",
      location: user?.location || "",
      gender: (user?.gender as "male" | "female" | undefined) || undefined,
      birth_date: user?.birth_date || "",
      social_links: (user?.social_links || []).map((link: SocialLink) => ({
        platform: link.platform,
        url: link.url,
        id: link.id,
        user_id: link.user_id,
      })),
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  useServerValidation(updateProfileMutation.error, form);

  const socialLinks = useFieldArray({
    control,
    name: "social_links",
  });

  /* Removed unused manual upload handlers */

  const onSubmit = (data: ProfileFormData) => {
    // Pastikan tipe gender sesuai dengan yang diharapkan oleh API
    updateProfileMutation.mutate({ data });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form
          onSubmit={handleSubmit(onSubmit, displayFormErrors)}
          className="space-y-6"
        >
          <FieldSet disabled={updateProfileMutation.isPending}>
            <FieldDescription>
              Perbarui informasi profil dan kontak Anda di sini.
            </FieldDescription>

            <FieldGroup className="grid gap-6 lg:grid-cols-[auto,1fr]">
              <div className="flex flex-col items-center gap-4">
                <Controller
                  control={control}
                  name="avatar"
                  render={({ field }) => (
                    <PhotoUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      name={user?.name || "U"}
                    />
                  )}
                />
                <FieldError>{errors.avatar?.message}</FieldError>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Masukkan nama lengkap"
                    onKeyDown={handleKeyDown}
                    className={cn(errors.name && "border-destructive")}
                  />
                  <FieldError>{errors.name?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="username">
                    Username <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="username"
                    {...register("username")}
                    placeholder="Masukkan username"
                    onKeyDown={handleKeyDown}
                    className={cn(errors.username && "border-destructive")}
                  />
                  <FieldError>{errors.username?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Masukkan email"
                    onKeyDown={handleKeyDown}
                    className={cn(errors.email && "border-destructive")}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">No. Telepon</FieldLabel>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Masukkan nomor telepon"
                    onKeyDown={handleKeyDown}
                    className={cn(errors.phone && "border-destructive")}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="location">Lokasi</FieldLabel>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Kota, negara"
                    onKeyDown={handleKeyDown}
                    className={cn(errors.location && "border-destructive")}
                  />
                  <FieldError>{errors.location?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={(value) =>
                          field.onChange(value as "male" | "female" | undefined)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            !field.value ? "text-muted-foreground" : undefined,
                            errors.gender && "border-destructive",
                          )}
                        >
                          <SelectValue placeholder="Pilih Gender" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{errors.gender?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="birth_date">Tanggal Lahir</FieldLabel>
                  <Input
                    id="birth_date"
                    type="date"
                    {...register("birth_date")}
                    className={cn(errors.birth_date && "border-destructive")}
                  />
                  <FieldDescription>Format: YYYY-MM-DD</FieldDescription>
                  <FieldError>{errors.birth_date?.message}</FieldError>
                </Field>
              </div>
            </FieldGroup>

            <FieldGroup className="grid gap-4">
              <Field>
                <FieldLabel>Headline</FieldLabel>
                <Input
                  {...register("headline")}
                  placeholder="Contoh: Product Designer & Frontend Developer"
                  onKeyDown={handleKeyDown}
                  className={cn(errors.headline && "border-destructive")}
                />
                <FieldError>{errors.headline?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Bio Singkat</FieldLabel>
                <Textarea
                  {...register("bio")}
                  rows={4}
                  placeholder="Ceritakan tentang latar belakang profesional Anda..."
                  className={cn(errors.bio && "border-destructive")}
                />
                <FieldError>{errors.bio?.message}</FieldError>
              </Field>
            </FieldGroup>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Media Sosial</FieldLabel>
                  <FieldDescription className="mt-1">
                    Gunakan platform yang tersedia untuk menjaga konsistensi
                    tautan.
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    socialLinks.append({
                      platform: SOCIAL_PLATFORM_OPTIONS[0]?.value ?? "linkedin",
                      url: "",
                    })
                  }
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>

              {socialLinks.fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Share2 className="h-6 w-6" />
                  </div>
                  <p className="font-medium">Belum ada tautan sosial</p>
                  <p className="text-sm">
                    Tambahkan tautan profil profesional Anda agar mudah
                    ditemukan.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {socialLinks.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-3 sm:flex-row sm:items-start"
                    >
                      <Field className="w-full sm:w-56">
                        <Controller
                          control={control}
                          name={`social_links.${index}.platform`}
                          render={({ field: controllerField }) => (
                            <Select
                              value={controllerField.value ?? ""}
                              onValueChange={(value) =>
                                controllerField.onChange(value)
                              }
                            >
                              <SelectTrigger
                                className={
                                  errors.social_links?.[index]?.platform
                                    ? "border-destructive"
                                    : undefined
                                }
                              >
                                <SelectValue placeholder="Pilih Platform" />
                              </SelectTrigger>
                              <SelectContent className="z-50">
                                {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError>
                          {errors.social_links?.[index]?.platform?.message}
                        </FieldError>
                      </Field>

                      <Field className="flex-1">
                        <Input
                          placeholder="https://example.com/username"
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
                        onClick={() => socialLinks.remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-center">
                <div className="bg-muted/50 rounded-full px-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    Bergabung sejak{" "}
                    <span className="font-medium text-foreground">
                      {dayjs
                        .utc(user?.created_at)
                        .local()
                        .format("DD MMMM YYYY") || "-"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FieldSet>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
