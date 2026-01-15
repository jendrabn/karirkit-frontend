import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUpdatePassword,
  type UpdatePasswordInput,
  updatePasswordInputSchema,
} from "@/features/account/api/update-password";
import { useServerValidation } from "@/hooks/use-server-validation";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChangePasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordInputSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const updatePasswordMutation = useUpdatePassword({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Password berhasil diubah");
        // Reset form after successful password change
        form.reset();
      },
      onError: (error) => {
        // Don't show generic error toast for validation errors
        // The useFormErrors hook will handle displaying field-specific errors
        console.error("Password update error:", error);
      },
    },
  });

  // Use the useServerValidation hook to handle server validation errors
  useServerValidation(updatePasswordMutation.error, form);

  const onSubmit = (data: UpdatePasswordInput) => {
    updatePasswordMutation.mutate({
      data: data,
    });
  };

  const isLoading = updatePasswordMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet disabled={isLoading} className="space-y-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Current Password */}
            <Field>
              <FieldLabel htmlFor="current_password">
                Password Saat Ini
              </FieldLabel>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...form.register("current_password")}
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError>
                {form.formState.errors.current_password?.message}
              </FieldError>
            </Field>

            {/* New Password */}
            <Field>
              <FieldLabel htmlFor="new_password">Password Baru</FieldLabel>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  {...form.register("new_password")}
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError>
                {form.formState.errors.new_password?.message}
              </FieldError>
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirm_password">
                Konfirmasi Password Baru
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirm_password")}
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError>
                {form.formState.errors.confirm_password?.message}
              </FieldError>
            </Field>
          </CardContent>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
};
export default ChangePasswordForm;
