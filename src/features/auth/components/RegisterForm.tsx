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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";
import {
  useRegister,
  registerInputSchema,
  type RegisterInput,
} from "@/lib/auth";
import { toast } from "sonner";
import { useFormErrors } from "@/hooks/use-form-errors";

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
      navigate("/dashboard");
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  const isSubmitting = registerMutation.isPending;

  // Handle form validation errors from API
  useFormErrors(form);

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
        <CardDescription>
          Mulai perjalanan karier Anda bersama KarirKit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Signup Button */}
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

        {/* Registration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <fieldset disabled={isSubmitting} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan username"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          {...field}
                          className="h-12 pr-12"
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Masukkan ulang password"
                          {...field}
                          className="h-12 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-muted-foreground leading-relaxed">
                Dengan mendaftar, Anda menyetujui{" "}
                <Link
                  to="/syarat-ketentuan"
                  className="text-primary hover:underline"
                >
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link
                  to="/kebijakan-privasi"
                  className="text-primary hover:underline"
                >
                  Kebijakan Privasi
                </Link>{" "}
                KarirKit
              </p>
            </fieldset>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>
        </Form>

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
