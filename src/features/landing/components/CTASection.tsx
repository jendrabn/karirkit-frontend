import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-primary-foreground rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium border border-primary-foreground/20">
            <Sparkles className="w-4 h-4" />
            <span>Gratis untuk memulai — Tanpa kartu kredit</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            Siap Memulai Perjalanan Karier Anda?
          </h2>
          
          <p className="text-primary-foreground/90 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan ribuan pencari kerja yang telah menemukan pekerjaan impian mereka dengan KarirKit.
          </p>
          
          {/* Benefits list */}
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {["CV Builder Gratis", "Unlimited Lamaran", "Template Profesional"].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-primary-foreground">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 h-14 px-10 text-base font-semibold shadow-2xl group"
              asChild
            >
              <a href="/auth/register" className="inline-flex items-center gap-2">
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 h-14 px-10 text-base font-medium"
              asChild
            >
              <a href="/blog">Baca Artikel Karier</a>
            </Button>
          </div>
          
          <p className="text-primary-foreground/70 text-sm pt-2">
            Lebih dari 1,000+ pengguna sudah bergabung bulan ini
          </p>
        </div>
      </div>
    </section>
  );
}
