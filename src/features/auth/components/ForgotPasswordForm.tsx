import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import {
  useForgotPassword,
  forgotPasswordInputSchema,
  type ForgotPasswordInput,
} from "@/features/auth/api/forgot-password";
import { toast } from "sonner";
import { useFormErrors } from "@/hooks/use-form-errors";

const ForgotPasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordInputSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword({
    mutationConfig: {
      onSuccess: (data: unknown) => {
        setEmail(form.getValues("email"));
        setSubmitted(true);
        // Type assertion based on API response structure
        const response = data as { message?: string };
        toast.success(response.message || "Email reset password telah dikirim");
      },
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPasswordMutation.mutate(data);
  };

  const isSubmitting = forgotPasswordMutation.isPending;

  // Handle form validation errors from API
  useFormErrors(form);

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="text-center space-y-2">
        {!submitted ? (
          <>
            <CardTitle className="text-2xl">Lupa Password?</CardTitle>
            <CardDescription>
              Masukkan email Anda dan kami akan mengirimkan link untuk reset
              password
            </CardDescription>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Cek Email Anda</CardTitle>
            <CardDescription>
              Kami telah mengirimkan link reset password ke{" "}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {!submitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <fieldset disabled={isSubmitting} className="space-y-4">
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
              </fieldset>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
              </Button>
            </form>
          </Form>
        ) : (
          <>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>Tidak menerima email? Periksa folder spam Anda atau</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                className="text-primary font-medium hover:underline mt-1"
              >
                coba kirim ulang
              </button>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium"
              onClick={() => {
                setSubmitted(false);
                form.reset();
              }}
            >
              Gunakan email lain
            </Button>
          </>
        )}

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke halaman masuk
        </Link>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
