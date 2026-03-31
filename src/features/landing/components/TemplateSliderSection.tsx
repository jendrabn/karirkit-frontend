import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import cv1 from "@/assets/images/templates/cv-1.webp";
import cv2 from "@/assets/images/templates/cv-2.webp";
import cv3 from "@/assets/images/templates/cv-3.webp";
import letter1 from "@/assets/images/templates/letter-1.webp";

const templates = [
  cv1,
  cv2,
  cv3,
  letter1,
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
            {templates.map((template, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
              >
                <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                  <div className="aspect-[3/4]">
                    <img
                      src={template}
                      alt={`Template ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
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
