import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { CTASection } from "@/features/landing/components/CTASection";
import { FAQSection } from "@/features/landing/components/FAQSection";
import { FeatureSelector } from "@/features/landing/components/FeatureSelector";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { TemplateSliderSection } from "@/features/landing/components/TemplateSliderSection";
import { TestimonialsSection } from "@/features/landing/components/TestimonialsSection";
import { TipsSection } from "@/features/landing/components/TipsSection";
import { TrustedBySection } from "@/features/landing/components/TrustedBySection";
import { useState } from "react";

const LandingRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginToggle={() => setIsLoggedIn(!isLoggedIn)}
      />

      <main>
        <HeroSection />

        <FeatureSelector />

        <TrustedBySection />

        <BenefitsSection />

        <TemplateSliderSection />

        <CTASection />

        <TestimonialsSection />

        <TipsSection />

        <FAQSection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingRouter;
