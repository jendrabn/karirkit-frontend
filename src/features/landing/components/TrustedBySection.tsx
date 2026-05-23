import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const companies = [
  {
    name: "Pertamina",
    logo: "/images/companies/pertamina-logo.svg",
  },
  {
    name: "Bank Mandiri",
    logo: "/images/companies/bank-mandiri-logo.svg",
  },
  {
    name: "Telkom Indonesia",
    logo: "/images/companies/telkom-indonesia-logo.svg",
  },
  {
    name: "Bank BRI",
    logo: "/images/companies/bank-bri-logo.svg",
  },
  {
    name: "Bank BNI",
    logo: "/images/companies/bank-bni-logo.png",
  },
  {
    name: "Bank BTN",
    logo: "/images/companies/bank-btn-logo.svg",
  },
  {
    name: "PLN",
    logo: "/images/companies/pln-logo.svg",
  },
  {
    name: "KAI",
    logo: "/images/companies/kai-logo.svg",
  },
  {
    name: "Garuda Indonesia",
    logo: "/images/companies/garuda-indonesia-logo.png",
  },
  {
    name: "Pupuk Indonesia",
    logo: "/images/companies/pupuk-indonesia-logo.png",
  },
  {
    name: "Bank Central Asia",
    logo: "/images/companies/bank-central-asia-logo.svg",
  },
  {
    name: "Google Indonesia",
    logo: "/images/companies/google-indonesia-logo.svg",
  },
  {
    name: "Shopee",
    logo: "/images/companies/shopee-logo.svg",
  },
  {
    name: "Tokopedia",
    logo: "/images/companies/tokopedia-logo.svg",
  },
  {
    name: "Gojek",
    logo: "/images/companies/gojek-logo.svg",
  },
  {
    name: "Traveloka",
    logo: "/images/companies/traveloka-logo.png",
  },
  {
    name: "Grab",
    logo: "/images/companies/grab-logo.svg",
  },
  {
    name: "Astra International",
    logo: "/images/companies/astra-international-logo.svg",
  },
  {
    name: "Indofood",
    logo: "/images/companies/indofood-logo.svg",
  },
  {
    name: "Unilever",
    logo: "/images/companies/unilever-logo.svg",
  },
] as const;

export function TrustedBySection() {
  return (
    <section className="border-y border-border/40 bg-muted/30 py-16 dark:border-border/60 dark:bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Dipercaya oleh pencari kerja dan profesional dari berbagai perusahaan
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {companies.map((company) => (
              <CarouselItem
                key={company.name}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <div className="flex h-12 items-center justify-center">
                  <img
                    src={company.logo}
                    alt={`Logo ${company.name}`}
                    loading="lazy"
                    className="max-h-8 w-auto object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 border-border bg-card hover:bg-secondary dark:bg-card dark:hover:bg-secondary" />
          <CarouselNext className="hidden md:flex -right-4 border-border bg-card hover:bg-secondary dark:bg-card dark:hover:bg-secondary" />
        </Carousel>
      </div>
    </section>
  );
}
