import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdatePassword,
  type UpdatePasswordInput,
  type UpdatePasswordRequest,
  updatePasswordInputSchema,
} from "@/features/account/api/update-password";
import { useFormErrors } from "@/hooks/use-form-errors";

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

  // Use the useFormErrors hook to handle server validation errors
  useFormErrors(form);

  const onSubmit = (data: UpdatePasswordInput) => {
    // Extract only the fields needed for the API request
    const { current_password, new_password }: UpdatePasswordRequest = data;
    updatePasswordMutation.mutate({
      data: { current_password, new_password },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="current_password">Password Saat Ini</Label>
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
        {form.formState.errors.current_password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.current_password.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="new_password">Password Baru</Label>
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
        {form.formState.errors.new_password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.new_password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
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
        {form.formState.errors.confirm_password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirm_password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={updatePasswordMutation.isPending}
      >
        {updatePasswordMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Ubah Password"
        )}
      </Button>
    </form>
  );
};
export default ChangePasswordForm;
