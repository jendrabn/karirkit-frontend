import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { CheckCircle2, EyeOff, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
import {
  useResetPassword,
  resetPasswordInputSchema,
  type ResetPasswordInput,
} from "@/features/auth/api/reset-password";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const resetPasswordMutation = useResetPassword({
    mutationConfig: {
      onSuccess: (data: unknown) => {
        setSuccess(true);
        const response = data as { message?: string };
        toast.success(response.message || "Password berhasil direset");
      },
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    resetPasswordMutation.mutate(data);
  };

  const isSubmitting = resetPasswordMutation.isPending;

  useServerValidation(resetPasswordMutation.error, form);

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="text-center space-y-2">
        {!success ? (
          <>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Buat password baru untuk akun Anda
            </CardDescription>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Password Berhasil Diubah</CardTitle>
            <CardDescription>
              Password Anda telah berhasil diperbarui. Silakan masuk dengan
              password baru Anda.
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {!success ? (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet disabled={isSubmitting}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">Password Baru</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      className="h-12 pr-12"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FieldError>
                    {form.formState.errors.password?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Konfirmasi Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kembali password baru"
                      className="h-12 pr-12"
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FieldError>
                    {form.formState.errors.confirmPassword?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </form>
        ) : (
          <Button className="w-full h-12 text-base font-semibold" asChild>
            <Link to="/auth/login">Masuk ke Akun</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
