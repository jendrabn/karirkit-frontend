import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
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
    rating: 5,
  },
  {
    name: "Siti Rahayu",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    quote: "CV Builder-nya simpel tapi hasilnya profesional banget. Saya bisa buat CV dalam waktu 15 menit dan langsung apply ke beberapa perusahaan.",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Fresh Graduate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote: "Sebagai fresh graduate, saya lebih percaya diri apply kerja dengan CV dan portofolio dari KarirKit. Desainnya modern dan eye-catching.",
    rating: 5,
  },
  {
    name: "Diana Putri",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote: "Fitur surat lamaran otomatis sangat menghemat waktu saya. Template yang tersedia juga sangat profesional dan mudah disesuaikan.",
    rating: 5,
  },
  {
    name: "Rizky Firmansyah",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    quote: "Portofolio digital dari KarirKit membantu saya showcase proyek-proyek saya dengan lebih menarik. Recruiter jadi lebih mudah melihat skill saya.",
    rating: 5,
  },
  {
    name: "Maya Anggraini",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    quote: "Platform yang sangat user-friendly! Saya bisa mengelola semua lamaran kerja dan portofolio dalam satu tempat. Highly recommended!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">Testimoni</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Dengar Cerita Pengguna KarirKit
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Ribuan pencari kerja sudah merasakan manfaat KarirKit untuk karier mereka
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
                <Card className="p-6 lg:p-8 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-border/50 group relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                  
                  <div className="relative z-10">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm lg:text-base">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static translate-y-0 bg-card hover:bg-secondary" />
            <CarouselNext className="static translate-y-0 bg-card hover:bg-secondary" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
