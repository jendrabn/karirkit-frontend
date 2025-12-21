import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { FeatureSelector } from "@/features/landing/components/FeatureSelector";
import { TrustedBySection } from "@/features/landing/components/TrustedBySection";
import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { TemplateSliderSection } from "@/features/landing/components/TemplateSliderSection";
import { CTASection } from "@/features/landing/components/CTASection";
import { TestimonialsSection } from "@/features/landing/components/TestimonialsSection";
import { TipsSection } from "@/features/landing/components/TipsSection";
import { FAQSection } from "@/features/landing/components/FAQSection";
import { Footer } from "@/components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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

export default Landing;
