import { Card } from "@/components/ui/card";
import {
  Clock,
  RefreshCw,
  Bell,
  Users,
  FileText,
  Send,
  LayoutTemplate,
  TrendingUp,
} from "lucide-react";
import { useStats } from "@/features/landing/api/get-stats";

export function BenefitsSection() {
  const { data: stats } = useStats();

  const getDisplayValue = (
    realValue: number | undefined,
    dummyValue: string
  ) => {
    // Logic: if realValue is missing or less than 1000, return dummyValue.
    // Otherwise return formatted realValue.
    if (realValue === undefined || realValue < 1000) {
      return dummyValue;
    }
    return realValue.toLocaleString("id-ID") + "+";
  };

  const statsList = [
    {
      icon: Users,
      value: getDisplayValue(stats?.total_users, "1.250+"),
      label: "Pengguna Aktif",
      color: "bg-primary/20",
    },
    {
      icon: FileText,
      value: getDisplayValue(stats?.total_cvs, "3.400+"),
      label: "CV Dibuat",
      color: "bg-secondary",
    },
    {
      icon: Send,
      value: getDisplayValue(stats?.total_application_letters, "2.100+"),
      label: "Surat Lamaran",
      color: "bg-accent",
    },
    {
      icon: LayoutTemplate,
      value: getDisplayValue(
        stats
          ? stats.total_cv_templates + stats.total_application_letter_templates
          : undefined,
        "50+"
      ),
      label: "Template Tersedia",
      color: "bg-primary/20",
    },
    {
      icon: Bell,
      value: getDisplayValue(stats?.total_applications, "5.800+"),
      label: "Lamaran Terkirim",
      color: "bg-secondary",
    },
    {
      icon: TrendingUp,
      value: "89%",
      label: "Tingkat Kepuasan",
      color: "bg-accent",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
                Keunggulan
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Atur Strategi Karier Anda dengan Lebih Terarah
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              KarirKit membantu Anda mengelola semua berkas dan lamaran kerja
              dalam satu tempat, sehingga Anda bisa fokus mempersiapkan diri
              untuk tahap berikutnya.
            </p>
            <div className="space-y-5">
              {[
                {
                  icon: Clock,
                  text: "Pantau progres lamaran secara real time",
                  color: "bg-primary/20",
                },
                {
                  icon: RefreshCw,
                  text: "Selaraskan CV, surat lamaran, dan portofolio",
                  color: "bg-secondary",
                },
                {
                  icon: Bell,
                  text: "Minimalkan risiko lupa follow up",
                  color: "bg-accent",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 group hover:translate-x-2 transition-transform cursor-default"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}
                  >
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-lg">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {statsList.map((stat, index) => (
              <Card
                key={index}
                className="p-5 lg:p-6 rounded-2xl card-shadow bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
