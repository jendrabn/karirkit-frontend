import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SEO } from "@/components/seo";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { SubscriptionManager } from "@/features/subscriptions/components/subscription-manager";

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

        <main className="flex-1 py-12">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="mb-2 text-3xl font-bold">
                  Harga Paket KarirKit
                </h1>
                <p className="text-muted-foreground">{pricingDescription}</p>
              </div>
            </div>

            <SubscriptionManager
              publicMode
              loginRedirectTo={paths.pricing.getHref()}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
