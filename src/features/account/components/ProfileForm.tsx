import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

        // Automatically update profile with new avatar
        const currentFormData = form.getValues();
        updateProfileMutation.mutate({
          data: { ...currentFormData, avatar: data.path },
        });

        toast.success("Avatar berhasil diupload dan disimpan");
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
        // Only show success message if this is not an automatic update from avatar upload
        if (!uploadMutation.isPending) {
          toast.success("Profil berhasil diperbarui");
        }
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <p className="text-xs text-muted-foreground">
          Klik ikon kamera untuk mengganti foto profil (maks. 2MB)
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Masukkan nama lengkap"
            onKeyDown={handleKeyDown}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...form.register("username")}
            placeholder="Masukkan username"
            onKeyDown={handleKeyDown}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-destructive">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="Masukkan email"
            onKeyDown={handleKeyDown}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">No. Telepon</Label>
          <Input
            id="phone"
            {...form.register("phone")}
            placeholder="Masukkan nomor telepon"
            onKeyDown={handleKeyDown}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-center">
          <div className="bg-muted/50 rounded-full px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Bergabung sejak{" "}
              <span className="font-medium text-foreground">
                {dayjs.utc(user?.created_at).local().format("DD MMMM YYYY") ||
                  "-"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={updateProfileMutation.isPending}
      >
        {updateProfileMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Perubahan"
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
