import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Andi Wijaya",
    role: "Software Engineer",
    quote:
      "Pernah lamar 30+ perusahaan tapi lupa tracking mana yang udah interview, mana yang belum. Sejak pakai KarirKit jadi lebih teratur, ada reminder follow-up juga.",
    rating: 5,
  },
  {
    name: "Sari Wulandari",
    role: "UI/UX Designer",
    quote:
      "Bikin CV sendiri susah banget layoutnya. Di sini tinggal isi form, pilih template, jadi deh. Hasilnya lebih rapi dari yang biasa aku buat di Word.",
    rating: 5,
  },
  {
    name: "Reza Pratama",
    role: "Fresh Graduate",
    quote:
      "Lagi nyari kerja pertama, bingung mau bikin CV gimana. Template di KarirKit cocok buat fresh grad, ada bagian buat project & organisasi kampus juga.",
    rating: 5,
  },
  {
    name: "Dinda Amelia",
    role: "Marketing Specialist",
    quote:
      "Surat lamaran selalu jadi PR banget. Sekarang tinggal pilih template paragraf, ganti dikit, langsung jadi. Ngirit waktu banget!",
    rating: 5,
  },
  {
    name: "Firman Hidayat",
    role: "Backend Developer",
    quote:
      "Portfolio ku lumayan banyak project, tapi ga punya website sendiri. Pakai KarirKit jadi punya link portfolio yang bisa di-share ke recruiter. Keren!",
    rating: 5,
  },
  {
    name: "Mega Kusuma",
    role: "Content Writer",
    quote:
      "Paling suka fitur tracking lamaran. Bisa liat statistik berapa yang pending, berapa yang udah interview. Jadi tahu harus follow-up kemana aja.",
    rating: 5,
  },
  {
    name: "Fajar Nugroho",
    role: "Data Analyst",
    quote:
      "Sempet ragu mau pakai atau nggak, eh ternyata gratis semua fiturnya. CV bisa download PDF, surat lamaran juga. Worth it banget!",
    rating: 5,
  },
  {
    name: "Rika Sari",
    role: "HR Generalist",
    quote:
      "Dulu aku kerjain Excel buat track lamaran. Ribet banget. KarirKit lebih praktis, UI-nya juga bagus, enak dipandang.",
    rating: 5,
  },
  {
    name: "Agus Setiawan",
    role: "Full Stack Developer",
    quote:
      "Bisa bikin banyak versi CV untuk posisi yang beda-beda. Satu buat frontend, satu buat fullstack. Flexibel banget.",
    rating: 5,
  },
  {
    name: "Nina Anggraini",
    role: "Graphic Designer",
    quote:
      "Portfolio-nya simpel tapi tetep kelihatan profesional. Client gampang liat hasil kerja aku lewat link yang aku share.",
    rating: 5,
  },
  {
    name: "Bayu Kusnandar",
    role: "Product Manager",
    quote:
      "Fitur follow-up reminder ngebantu banget. Sering lupa mau follow-up kapan, sekarang ada notif jadi ga kelewat.",
    rating: 5,
  },
  {
    name: "Dewi Lestari",
    role: "Business Analyst",
    quote:
      "Awalnya skeptis sama CV builder online, tapi hasil download-nya bagus. Format-nya rapi, tinggal print atau kirim email.",
    rating: 5,
  },
  {
    name: "Hendra Gunawan",
    role: "Mobile Developer",
    quote:
      "Bisa masukin link GitHub sama demo project di CV. Recruiter langsung bisa cek skill aku tanpa perlu tanya-tanya lagi.",
    rating: 5,
  },
  {
    name: "Lina Puspita",
    role: "Digital Marketing",
    quote:
      "Templatenya ada Indonesia sama Inggris. Jadi pas apply ke perusahaan luar tinggal ganti bahasa aja, praktis!",
    rating: 5,
  },
  {
    name: "Yoga Aditya",
    role: "QA Engineer",
    quote:
      "Dashboard-nya clean, ga ribet. Semua info lamaran keliatan jelas: mana yang pending, mana yang udah offering.",
    rating: 5,
  },
  {
    name: "Putri Maharani",
    role: "Customer Success",
    quote:
      "Suka banget sama fitur statistik lamaran. Jadi tahu tingkat keberhasilan apply aku berapa persen. Motivasi buat terus coba!",
    rating: 5,
  },
  {
    name: "Arief Rahman",
    role: "DevOps Engineer",
    quote:
      "Download limit 10 per hari cukup kok buat daily use. Jarang banget butuh download lebih dari itu dalam sehari.",
    rating: 5,
  },
  {
    name: "Sinta Permata",
    role: "Sales Executive",
    quote:
      "Ga perlu install aplikasi, buka browser langsung bisa. Bisa akses dari HP atau laptop, datanya tetep sinkron.",
    rating: 5,
  },
  {
    name: "Irfan Hakim",
    role: "System Administrator",
    quote:
      "Paling berguna buat aku yang lagi job hunting. Semua lamaran tercatat, kontak HRD-nya juga kesimpan. Tinggal buka kapan aja butuh.",
    rating: 5,
  },
  {
    name: "Ayu Rahmawati",
    role: "Project Coordinator",
    quote:
      "Template surat lamarannya profesional banget. Aku tinggal edit dikit sesuai posisi yang dilamar, sisanya udah oke.",
    rating: 5,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background py-16 lg:py-24">
      <div className="absolute left-0 top-1/2 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto relative z-10 px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
            Testimoni
          </p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Dengar Cerita Pengguna KarirKit
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
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
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-8">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col">
                    <Quote className="mb-4 h-10 w-10 text-primary/20" />

                    <div className="mb-5 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
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
