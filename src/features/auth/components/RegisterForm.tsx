import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";
import {
  useRegister,
  registerInputSchema,
  type RegisterInput,
} from "@/lib/auth";
import { toast } from "sonner";
import { useServerValidation } from "@/hooks/use-server-validation";
import { paths } from "@/config/paths";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const registerMutation = useRegister({
    onSuccess: () => {
      toast.success("Registrasi berhasil! Selamat datang.");
      navigate(paths.dashboard.getHref());
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  const isSubmitting = registerMutation.isPending;

  useServerValidation(registerMutation.error, form);

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
        <CardDescription>
          Mulai perjalanan karier Anda bersama KarirKit
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <GoogleLoginButton
          disabled={isSubmitting}
          text="Daftar dengan Google"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">atau</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet disabled={isSubmitting}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                <Input
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  className="h-12"
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="Masukkan username"
                  className="h-12"
                  {...form.register("username")}
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
                  placeholder="nama@email.com"
                  className="h-12"
                  {...form.register("email")}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                <FieldLabel htmlFor="confirm_password">
                  Konfirmasi Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Masukkan ulang password"
                    className="h-12 pr-12"
                    {...form.register("confirm_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FieldError>
                  {form.formState.errors.confirm_password?.message}
                </FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            to="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
