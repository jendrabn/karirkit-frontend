import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

const ResetPassword = () => {
  return (
    <>
      <MinimalSEO
        title={seoConfig.resetPassword.title}
        description={seoConfig.resetPassword.description}
        noIndex={true}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
          <ResetPasswordForm />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ResetPassword;
