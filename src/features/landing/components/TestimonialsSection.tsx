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
    name: "Andi Wijaya",
    role: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote:
      "Pernah lamar 30+ perusahaan tapi lupa tracking mana yang udah interview, mana yang belum. Sejak pakai KarirKit jadi lebih teratur, ada reminder follow-up juga.",
    rating: 5,
  },
  {
    name: "Sari Wulandari",
    role: "UI/UX Designer",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    quote:
      "Bikin CV sendiri susah banget layoutnya. Di sini tinggal isi form, pilih template, jadi deh. Hasilnya lebih rapi dari yang biasa aku buat di Word.",
    rating: 5,
  },
  {
    name: "Reza Pratama",
    role: "Fresh Graduate",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote:
      "Lagi nyari kerja pertama, bingung mau bikin CV gimana. Template di KarirKit cocok buat fresh grad, ada bagian buat project & organisasi kampus juga.",
    rating: 5,
  },
  {
    name: "Dinda Amelia",
    role: "Marketing Specialist",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote:
      "Surat lamaran selalu jadi PR banget. Sekarang tinggal pilih template paragraf, ganti dikit, langsung jadi. Ngirit waktu banget!",
    rating: 5,
  },
  {
    name: "Firman Hidayat",
    role: "Backend Developer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    quote:
      "Portfolio ku lumayan banyak project, tapi ga punya website sendiri. Pakai KarirKit jadi punya link portfolio yang bisa di-share ke recruiter. Keren!",
    rating: 5,
  },
  {
    name: "Mega Kusuma",
    role: "Content Writer",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    quote:
      "Paling suka fitur tracking lamaran. Bisa liat statistik berapa yang pending, berapa yang udah interview. Jadi tahu harus follow-up kemana aja.",
    rating: 5,
  },
  {
    name: "Fajar Nugroho",
    role: "Data Analyst",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    quote:
      "Sempet ragu mau pakai atau nggak, eh ternyata gratis semua fiturnya. CV bisa download PDF, surat lamaran juga. Worth it banget!",
    rating: 5,
  },
  {
    name: "Rika Sari",
    role: "HR Generalist",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    quote:
      "Dulu aku kerjain Excel buat track lamaran. Ribet banget. KarirKit lebih praktis, UI-nya juga bagus, enak dipandang.",
    rating: 5,
  },
  {
    name: "Agus Setiawan",
    role: "Full Stack Developer",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    quote:
      "Bisa bikin banyak versi CV untuk posisi yang beda-beda. Satu buat frontend, satu buat fullstack. Flexibel banget.",
    rating: 5,
  },
  {
    name: "Nina Anggraini",
    role: "Graphic Designer",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face",
    quote:
      "Portfolio-nya simpel tapi tetep kelihatan profesional. Client gampang liat hasil kerja aku lewat link yang aku share.",
    rating: 5,
  },
  {
    name: "Bayu Kusnandar",
    role: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    quote:
      "Fitur follow-up reminder ngebantu banget. Sering lupa mau follow-up kapan, sekarang ada notif jadi ga kelewat.",
    rating: 5,
  },
  {
    name: "Dewi Lestari",
    role: "Business Analyst",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    quote:
      "Awalnya skeptis sama CV builder online, tapi hasil download-nya bagus. Format-nya rapi, tinggal print atau kirim email.",
    rating: 5,
  },
  {
    name: "Hendra Gunawan",
    role: "Mobile Developer",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    quote:
      "Bisa masukin link GitHub sama demo project di CV. Recruiter langsung bisa cek skill aku tanpa perlu tanya-tanya lagi.",
    rating: 5,
  },
  {
    name: "Lina Puspita",
    role: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
    quote:
      "Templatenya ada Indonesia sama Inggris. Jadi pas apply ke perusahaan luar tinggal ganti bahasa aja, praktis!",
    rating: 5,
  },
  {
    name: "Yoga Aditya",
    role: "QA Engineer",
    image:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=100&h=100&fit=crop&crop=face",
    quote:
      "Dashboard-nya clean, ga ribet. Semua info lamaran keliatan jelas: mana yang pending, mana yang udah offering.",
    rating: 5,
  },
  {
    name: "Putri Maharani",
    role: "Customer Success",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    quote:
      "Suka banget sama fitur statistik lamaran. Jadi tahu tingkat keberhasilan apply aku berapa persen. Motivasi buat terus coba!",
    rating: 5,
  },
  {
    name: "Arief Rahman",
    role: "DevOps Engineer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote:
      "Download limit 10 per hari cukup kok buat daily use. Jarang banget butuh download lebih dari itu dalam sehari.",
    rating: 5,
  },
  {
    name: "Sinta Permata",
    role: "Sales Executive",
    image:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop&crop=face",
    quote:
      "Ga perlu install aplikasi, buka browser langsung bisa. Bisa akses dari HP atau laptop, datanya tetep sinkron.",
    rating: 5,
  },
  {
    name: "Irfan Hakim",
    role: "System Administrator",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    quote:
      "Paling berguna buat aku yang lagi job hunting. Semua lamaran tercatat, kontak HRD-nya juga kesimpan. Tinggal buka kapan aja butuh.",
    rating: 5,
  },
  {
    name: "Ayu Rahmawati",
    role: "Project Coordinator",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    quote:
      "Template surat lamarannya profesional banget. Aku tinggal edit dikit sesuai posisi yang dilamar, sisanya udah oke.",
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
          <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
            Testimoni
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Dengar Cerita Pengguna KarirKit
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Ribuan pencari kerja sudah merasakan manfaat KarirKit untuk karier
            mereka
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
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="p-6 lg:p-8 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-border/50 group relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />

                  <div className="relative z-10">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm lg:text-base">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
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
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static translate-y-0 bg-card hover:bg-secondary" />
            <CarouselNext className="static translate-y-0 bg-card hover:bg-secondary" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
