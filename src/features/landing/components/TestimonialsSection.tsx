import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote: "KarirKit sangat membantu saya melacak semua lamaran kerja. Sebelumnya saya sering lupa follow up, tapi sekarang semua tercatat rapi dengan pengingat otomatis.",
  },
  {
    name: "Siti Rahayu",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    quote: "CV Builder-nya simpel tapi hasilnya profesional banget. Saya bisa buat CV dalam waktu 15 menit dan langsung apply ke beberapa perusahaan.",
  },
  {
    name: "Budi Santoso",
    role: "Fresh Graduate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote: "Sebagai fresh graduate, saya lebih percaya diri apply kerja dengan CV dan portofolio dari KarirKit. Desainnya modern dan eye-catching.",
  },
  {
    name: "Diana Putri",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote: "Fitur surat lamaran otomatis sangat menghemat waktu saya. Template yang tersedia juga sangat profesional dan mudah disesuaikan.",
  },
  {
    name: "Rizky Firmansyah",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    quote: "Portofolio digital dari KarirKit membantu saya showcase proyek-proyek saya dengan lebih menarik. Recruiter jadi lebih mudah melihat skill saya.",
  },
  {
    name: "Maya Anggraini",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    quote: "Platform yang sangat user-friendly! Saya bisa mengelola semua lamaran kerja dan portofolio dalam satu tempat. Highly recommended!",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2">Testimoni</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Dengar Cerita Pengguna KarirKit
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
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 rounded-2xl card-shadow bg-card hover:card-shadow-hover transition-shadow h-full">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
