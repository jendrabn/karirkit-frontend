import { Card } from "@/components/ui/card";
import {
  Clock,
  RefreshCw,
  Bell,
  Users,
  FileText,
  Send,
  LayoutTemplate,
} from "lucide-react";
// import { useStats } from "../api/get-stats";

export function BenefitsSection() {
  // const stats = useStats();

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Atur Strategi Karier Anda dengan Lebih Terarah
            </h2>
            <p className="text-muted-foreground text-lg">
              KarirKit membantu Anda mengelola semua berkas dan lamaran kerja
              dalam satu tempat, sehingga Anda bisa fokus mempersiapkan diri
              untuk tahap berikutnya.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: Clock,
                  text: "Pantau progres lamaran secara real time",
                },
                {
                  icon: RefreshCw,
                  text: "Selaraskan CV, surat lamaran, dan portofolio",
                },
                { icon: Bell, text: "Minimalkan risiko lupa follow up" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 rounded-2xl card-shadow bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">1,250+</p>
                  <p className="text-xs text-muted-foreground">
                    Pengguna Aktif
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl card-shadow bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">3,400+</p>
                  <p className="text-xs text-muted-foreground">CV Dibuat</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl card-shadow bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">2,100+</p>
                  <p className="text-xs text-muted-foreground">Surat Lamaran</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl card-shadow bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-xs text-muted-foreground">
                    Template Tersedia
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl card-shadow bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">5,800+</p>
                  <p className="text-xs text-muted-foreground">
                    Lamaran Terkirim
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
