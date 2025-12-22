import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const templates = [
  {
    id: 1,
    title: "Surat Lamaran Kerja - Formal",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
    type: "Surat Lamaran",
  },
  {
    id: 2,
    title: "Surat Lamaran Kerja - Modern",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop",
    type: "Surat Lamaran",
  },
  {
    id: 3,
    title: "CV Profesional",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
    type: "CV",
  },
  {
    id: 4,
    title: "CV Modern",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop",
    type: "CV",
  },
  {
    id: 5,
    title: "CV Kreatif",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
    type: "CV",
  },
  {
    id: 6,
    title: "Surat Lamaran Kerja - Minimalis",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop",
    type: "Surat Lamaran",
  },
];

export function TemplateSliderSection() {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Desain profesional, siap pakai untuk karir impianmu!
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem key={template.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded mb-2">
                        {template.type}
                      </span>
                      <p className="text-sm font-medium text-primary-foreground line-clamp-2">
                        {template.title}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-secondary" />
          <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-secondary" />
        </Carousel>
      </div>
    </section>
  );
}
