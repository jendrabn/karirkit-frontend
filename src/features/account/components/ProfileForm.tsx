import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useUploadFile, type UploadResponse } from "@/lib/upload";
import { dayjs } from "@/lib/date";
import { buildImageUrl } from "@/lib/utils";
import {
  useUpdateProfile,
  type UpdateProfileInput,
} from "@/features/account/api/update-profile";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/types/api";
import { useFormErrors } from "@/hooks/use-form-errors";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ProfileFormData = UpdateProfileInput;

const ProfileForm = () => {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(
    buildImageUrl(user?.avatar) || ""
  );

  const uploadMutation = useUploadFile({
    mutationConfig: {
      onSuccess: (data: UploadResponse) => {
        form.setValue("avatar", data.path);
        // Update avatar preview with the uploaded image URL
        setAvatarPreview(buildImageUrl(data.path));
        toast.success("Foto berhasil diupload, silakan klik Simpan Perubahan");
      },
      onError: (error: Error) => {
        toast.error("Gagal mengupload avatar");
        console.error("Upload error:", error);
      },
    },
  });

  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: (data: User) => {
        toast.success("Profil berhasil diperbarui");
        console.log("Updated profile:", data);
      },
      onError: (error: Error) => {
        // Don't show generic error toast for validation errors
        // The useFormErrors hook will handle displaying field-specific errors
        console.error("Update error:", error);
      },
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Nama wajib diisi"),
        username: z.string().min(3, "Username minimal 3 karakter"),
        email: z.string().email("Format email tidak valid"),
        phone: z.string().optional(),
        avatar: z.string().optional(),
      })
    ),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    },
  });

  // Use the useFormErrors hook to handle server validation errors
  useFormErrors(form);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadMutation.mutate(file);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate({ data });
  };

  // Handle form submission on Enter key
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet
            disabled={updateProfileMutation.isPending}
            className="space-y-6 mb-6"
          >
            <FieldLegend>Informasi Profil</FieldLegend>
            <FieldDescription>
              Perbarui informasi profil dan kontak Anda di sini.
            </FieldDescription>

            <FieldGroup>
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={buildImageUrl(avatarPreview)} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    {uploadMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadMutation.isPending}
                  />
                </div>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Masukkan nama lengkap"
                  onKeyDown={handleKeyDown}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="Masukkan username"
                  onKeyDown={handleKeyDown}
                />
                <FieldError>
                  {form.formState.errors.username?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Masukkan email"
                  onKeyDown={handleKeyDown}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">No. Telepon</FieldLabel>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="Masukkan nomor telepon"
                  onKeyDown={handleKeyDown}
                />
                <FieldError>{form.formState.errors.phone?.message}</FieldError>
              </Field>
            </FieldGroup>

            {/* Timestamp */}
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

          <div className="flex justify-end gap-3 pt-6 border-t mt-8">
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
