import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
        <ResetPasswordForm />
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
