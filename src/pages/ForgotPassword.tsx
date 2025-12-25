import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

const ForgotPassword = () => {
  return (
    <>
      <MinimalSEO
        title={seoConfig.forgotPassword.title}
        description={seoConfig.forgotPassword.description}
        noIndex={true}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
          <ForgotPasswordForm />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ForgotPassword;
