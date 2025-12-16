import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import RegisterForm from "@/features/auth/components/register-form";

const RegisterRouter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
        <RegisterForm />
      </div>
      <Footer />
    </div>
  );
};

export default RegisterRouter;
