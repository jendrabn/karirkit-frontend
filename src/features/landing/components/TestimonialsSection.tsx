import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

export function TestimonialsSection() {
  const { t } = useTranslation("landing");
  const testimonials = t("testimonials.items", { returnObjects: true }) as Array<{
    name: string;
    role: string;
    quote: string;
  }>;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background py-16 lg:py-24">
      <div className="absolute left-0 top-1/2 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto relative z-10 px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
            {t("testimonials.eyebrow")}
          </p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {t("testimonials.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("testimonials.description")}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-8">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col">
                    <Quote className="mb-4 h-10 w-10 text-primary/20" />

                    <div className="mb-5 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>

                    <p className="flex-1 text-base leading-relaxed text-foreground">
                      "{testimonial.quote}"
                    </p>

                    <div className="mt-6 flex items-center gap-4 border-t border-border/60 pt-5">
                      <Avatar className="h-12 w-12 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(testimonial.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
