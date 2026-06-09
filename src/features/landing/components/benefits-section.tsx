import { Card } from "@/components/ui/card";
import {
  Clock,
  RefreshCw,
  Bell,
  Crown,
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
    dummyValue: string,
  ) => {
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
        "50+",
      ),
      label: "Template Tersedia",
      color: "bg-primary/20",
    },
    {
      icon: Bell,
      value: getDisplayValue(stats?.total_applications, "5.800+"),
      label: "Lamaran Tercatat",
      color: "bg-secondary",
    },
    {
      icon: TrendingUp,
      value: "89%",
      label: "Tingkat Kepuasan",
      color: "bg-accent",
    },
  ];

  const items = [
    {
      icon: Clock,
      text: "Track semua lamaran, status, dan follow-up dari satu dashboard",
      color: "bg-primary/20",
    },
    {
      icon: RefreshCw,
      text: "Buat CV, surat lamaran, portfolio, dan dokumen tanpa pindah alat",
      color: "bg-secondary",
    },
    {
      icon: Bell,
      text: "Atur reminder follow-up, template, filter, dan catatan dalam satu alur",
      color: "bg-accent",
    },
    {
      icon: Crown,
      text: "Upgrade langganan untuk membuka template premium dan limit yang lebih besar",
      color: "bg-primary/20",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
                Keunggulan
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Satu Tempat untuk Lamaran, Dokumen, dan Langganan
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Dari melacak lamaran sampai membuat CV, surat lamaran, portfolio, dan dokumen, semua ada dalam satu platform. Saat butuh akses tambahan, kamu juga bisa upgrade ke paket langganan yang sesuai kebutuhan.
            </p>
            <div className="space-y-5">
              {items.map((item, index) => (
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
