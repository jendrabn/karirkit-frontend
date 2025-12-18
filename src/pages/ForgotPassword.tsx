import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
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
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleSubmit}
                >
                  Kirim Link Reset
                </Button>
              </>
            ) : (
              <>
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p>Tidak menerima email? Periksa folder spam Anda atau</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-medium hover:underline mt-1"
                  >
                    coba kirim ulang
                  </button>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={() => setSubmitted(false)}
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
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
