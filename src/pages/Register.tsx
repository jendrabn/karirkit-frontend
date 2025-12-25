import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import RegisterForm from "@/features/auth/components/RegisterForm";

import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

const Register = () => {
  return (
    <>
      <MinimalSEO
        title={seoConfig.register.title}
        description={seoConfig.register.description}
        noIndex={true}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
          <RegisterForm />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Register;
