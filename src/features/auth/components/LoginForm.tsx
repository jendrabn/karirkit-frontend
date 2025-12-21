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
import { useLogin, loginInputSchema, type LoginInput } from "@/lib/auth";
import { toast } from "sonner";
import { useFormErrors } from "@/hooks/use-form-errors";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const loginMutation = useLogin({
    onSuccess: () => {
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate("/dashboard");
    },
    onOtpRequired: (data) => {
      toast.success(data.message || "OTP telah dikirim ke email Anda.");
      // Store login credentials in sessionStorage for OTP verification
      sessionStorage.setItem("otp_identifier", form.getValues("identifier"));
      sessionStorage.setItem("otp_password", form.getValues("password"));
      sessionStorage.setItem("otp_expires_at", data.expiresAt.toString());
      sessionStorage.setItem(
        "otp_resend_available_at",
        data.resendAvailableAt.toString()
      );

      navigate("/auth/verify-otp");
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  const isSubmitting = loginMutation.isPending;

  // Handle form validation errors from API
  useFormErrors(form);

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
        <CardDescription>
          Masukkan email atau username dan password Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Login Button */}
        <GoogleLoginButton disabled={isSubmitting} text="Masuk dengan Google" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">atau</span>
          </div>
        </div>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <fieldset disabled={isSubmitting} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email atau Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nama@email.com atau username"
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Lupa password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
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
            </fieldset>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Masuk..." : "Masuk"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            to="/auth/register"
            className="text-primary font-medium hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
