import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import LoginForm from "@/features/auth/components/login-form";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-linear-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
