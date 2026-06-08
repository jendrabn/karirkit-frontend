import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { SubscriptionManager } from "@/features/subscriptions/components/SubscriptionManager";

const pricingDescription =
  "Bandingkan paket KarirKit untuk membuat CV profesional, mengelola lamaran kerja, membuat surat lamaran, dan memakai fitur karier premium.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Harga Paket KarirKit",
      description: pricingDescription,
      url: `${env.APP_URL}${paths.pricing.getHref()}`,
      isPartOf: {
        "@type": "WebSite",
        name: env.APP_NAME,
        url: env.APP_URL,
      },
      about: {
        "@type": "WebApplication",
        name: env.APP_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
      },
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
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: `${env.APP_URL}${paths.pricing.getHref()}`,
        },
      ],
    },
  ],
};

export default function Pricing() {
  return (
    <>
      <SEO
        title="Harga Paket KarirKit"
        description={pricingDescription}
        keywords="harga karirkit, paket karirkit, pricing karirkit, langganan karirkit, cv maker premium, aplikasi lamaran kerja premium"
        url={paths.pricing.getHref()}
        type="website"
        structuredData={structuredData}
      />

      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />

        <main className="flex-1">
          <section className="border-b bg-muted/35">
            <div className="container mx-auto max-w-4xl px-4 py-12 text-center lg:px-8 lg:py-16">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Harga Paket KarirKit
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Pilih paket yang sesuai untuk membuat CV, mengelola lamaran,
                menyiapkan surat lamaran, dan membuka fitur premium KarirKit.
              </p>
            </div>
          </section>

          <section className="py-10 lg:py-14">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
              <SubscriptionManager
                publicMode
                loginRedirectTo={paths.pricing.getHref()}
              />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
