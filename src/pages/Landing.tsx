import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeatureSelector } from "@/features/landing/components/feature-selector";
import { TrustedBySection } from "@/features/landing/components/trusted-by-section";
import { BenefitsSection } from "@/features/landing/components/benefits-section";
import { TemplateSliderSection } from "@/features/landing/components/template-slider-section";
import { CTASection } from "@/features/landing/components/cta-section";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { TipsSection } from "@/features/landing/components/tips-section";
import { FAQSection } from "@/features/landing/components/faq-section";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { env } from "@/config/env";

const Landing = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${env.APP_URL}/#website`,
        url: env.APP_URL,
        name: env.APP_NAME,
        description:
          "Platform all-in-one untuk mengelola lamaran kerja, membuat CV, surat lamaran, dan portofolio digital",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${env.APP_URL}/blog?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${env.APP_URL}/#organization`,
        name: env.APP_NAME,
        url: env.APP_URL,
        logo: {
          "@type": "ImageObject",
          url: `${env.APP_URL}/images/logo.png`,
        },
        sameAs: [
          "https://www.facebook.com/karirkit",
          "https://www.instagram.com/karirkit",
          "https://www.linkedin.com/company/karirkit",
        ],
      },
      {
        "@type": "WebApplication",
        name: env.APP_NAME,
        url: env.APP_URL,
        description:
          "Platform all-in-one untuk mengelola lamaran kerja, membuat CV, surat lamaran, dan portofolio digital",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
        },
        featureList: [
          "Pelacakan Lamaran Kerja",
          "Pembuat CV Profesional",
          "Generator Surat Lamaran",
          "Portofolio Digital",
          "Template CV & Surat Lamaran",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: env.APP_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Apa itu KarirKit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "KarirKit adalah platform all-in-one yang membantu Anda mengelola lamaran kerja, membuat CV profesional, surat lamaran, dan portofolio digital dengan mudah.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah KarirKit gratis?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ya, KarirKit menyediakan fitur dasar secara gratis untuk membantu Anda dalam perjalanan karir.",
            },
          },
          {
            "@type": "Question",
            name: "Fitur apa saja yang tersedia di KarirKit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "KarirKit menyediakan fitur pelacakan lamaran kerja, pembuat CV profesional, generator surat lamaran, portofolio digital, dan berbagai template yang dapat disesuaikan.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Platform All-in-One untuk Mengelola Karir Anda"
        description="KarirKit adalah platform lengkap untuk mengelola lamaran kerja, membuat CV profesional, surat lamaran, dan portofolio digital. Tingkatkan peluang karir Anda dengan tools yang mudah digunakan."
        keywords="karirkit, lamaran kerja, cv maker, curriculum vitae, surat lamaran, cover letter, portofolio digital, job application tracker, career management, lowongan kerja, pencari kerja, job seeker, resume builder, aplikasi karir, manajemen karir, template cv, template surat lamaran"
        url="/"
        type="website"
        structuredData={structuredData}
      />

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
