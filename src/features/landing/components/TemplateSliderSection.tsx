import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  useTemplates,
  type Template,
} from "@/features/landing/api/get-templates";
import { buildImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateSliderSection() {
  const { data, isLoading } = useTemplates();
  const templates = data?.items || [];

  const getTemplateTypeLabel = (type: Template["type"]) => {
    switch (type) {
      case "cv":
        return "CV";
      case "application_letter":
        return "Surat Lamaran";
      default:
        return type;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Desain profesional, siap pakai untuk karir impianmu!
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[3/4] w-full rounded-xl"
              />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {templates.map((template) => (
                <CarouselItem
                  key={template.id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={buildImageUrl(template.preview)}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded mb-2 capitalize">
                          {getTemplateTypeLabel(template.type)}
                        </span>
                        <p className="text-sm font-medium text-white line-clamp-2">
                          {template.name}
                        </p>
                      </div>
                      {template.is_premium && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded shadow-sm">
                          PREMIUM
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-secondary" />
            <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-secondary" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
