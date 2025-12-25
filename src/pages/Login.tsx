import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import LoginForm from "@/features/auth/components/LoginForm";

import { MinimalSEO } from "@/components/MinimalSEO";
import { seoConfig } from "@/config/seo";

const Login = () => {
  return (
    <>
      <MinimalSEO
        title={seoConfig.login.title}
        description={seoConfig.login.description}
        noIndex={true}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
          <LoginForm />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
