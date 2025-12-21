import { Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import OTPVerificationForm from "@/features/auth/components/OTPVerificationForm";

const OTPVerification = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 via-background to-primary/10">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg border p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verifikasi Email
              </h1>
              <p className="text-muted-foreground text-sm">
                Masukkan 6 digit kode OTP yang telah dikirim ke email Anda
              </p>
            </div>

            <OTPVerificationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OTPVerification;
