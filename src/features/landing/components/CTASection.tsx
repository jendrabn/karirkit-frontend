import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Gratis untuk memulai</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground">
            Siap Memulai Perjalanan Karier Anda?
          </h2>
          
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Bergabung dengan ribuan pencari kerja yang telah menemukan pekerjaan impian mereka dengan KarirKit. Buat akun gratis dan mulai sekarang.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 h-12 px-8 text-base font-semibold"
              asChild
            >
              <a href="/auth/register" className="inline-flex items-center gap-2">
                Daftar Gratis Sekarang
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8 text-base"
              asChild
            >
              <a href="/blog">Baca Artikel Karier</a>
            </Button>
          </div>
          
          <p className="text-primary-foreground/60 text-sm pt-2">
            Tidak perlu kartu kredit • Akses penuh ke semua fitur dasar
          </p>
        </div>
      </div>
    </section>
  );
}
