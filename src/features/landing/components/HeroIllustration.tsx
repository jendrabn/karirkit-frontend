import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BarChart3,
  Bookmark,
  Briefcase,
  Check,
  Clock3,
  FileText,
  FolderOpen,
  LayoutGrid,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type HeroIllustrationProps = {
  className?: string;
};

type BadgeTone = "emerald" | "amber" | "rose" | "sky" | "slate";

const applications = [
  {
    company: "Tokopedia",
    role: "Product Designer",
    stage: "Interview",
    tone: "emerald" as const,
  },
  {
    company: "Ruangguru",
    role: "UI Designer",
    stage: "Applied",
    tone: "sky" as const,
  },
  {
    company: "Traveloka",
    role: "UX Researcher",
    stage: "Rejected",
    tone: "rose" as const,
  },
  {
    company: "Gojek",
    role: "Design Systems",
    stage: "Offer",
    tone: "amber" as const,
  },
];

const pipeline = [
  {
    title: "Applied",
    count: 8,
    tone: "sky" as const,
  },
  {
    title: "Interview",
    count: 3,
    tone: "emerald" as const,
  },
  {
    title: "Offer",
    count: 1,
    tone: "amber" as const,
  },
];

const skillTags = ["ATS Ready", "Figma", "Product Thinking", "UX Writing"];

const documents = [
  {
    name: "Resume-Product.pdf",
    meta: "PDF / 2.4 MB",
    tone: "emerald" as const,
  },
  {
    name: "Cover-Letter.docx",
    meta: "DOCX / 186 KB",
    tone: "amber" as const,
  },
  {
    name: "Portfolio-Deck.pdf",
    meta: "PDF / 4.9 MB",
    tone: "sky" as const,
  },
];

const analytics = [
  {
    label: "Sent",
    value: "24",
    helper: "+6 minggu ini",
  },
  {
    label: "Interview",
    value: "7",
    helper: "29% rate",
  },
  {
    label: "Response",
    value: "64%",
    helper: "stabil",
  },
];

const analyticsBars = [74, 56, 82, 63, 92, 68];

const timelineSteps = [
  {
    title: "Apply",
    done: true,
  },
  {
    title: "Screening",
    done: true,
  },
  {
    title: "Interview",
    done: true,
  },
  {
    title: "Offer",
    done: false,
  },
];

const projects = [
  {
    title: "Hiring Flow",
    subtitle: "Case Study",
  },
  {
    title: "Career Portal",
    subtitle: "Landing Page",
  },
];

const badgeToneClasses: Record<BadgeTone, string> = {
  emerald: "border-[#bfe1cd] bg-[#edf8f0] text-[#246545]",
  amber: "border-[#ead9b0] bg-[#fbf4df] text-[#8b6a18]",
  rose: "border-[#efc9cf] bg-[#fff1f3] text-[#b44b5e]",
  sky: "border-[#cde2ee] bg-[#f1f7fb] text-[#3f6d83]",
  slate: "border-[#d5ddd8] bg-[#f6f8f6] text-[#5e6f65]",
};

function HeroCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-[#d7e2db] bg-white p-3.5 shadow-[0_24px_60px_-36px_rgba(36,101,69,0.36)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon: Icon,
  title,
  chip,
}: {
  icon: LucideIcon;
  title: string;
  chip?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-[#eef5f0] text-[#246545]">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold tracking-[0.01em] text-[#264437]">
            {title}
          </p>
          <p className="text-[10px] text-[#6d7d74]">KarirKit</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {chip ? (
          <span className="rounded-full border border-[#dbe5de] bg-[#f8faf8] px-2 py-1 text-[10px] font-medium text-[#5f7066]">
            {chip}
          </span>
        ) : null}
        <div className="flex items-center gap-1.5 text-[#91a297]">
          <span className="size-1.5 rounded-full bg-current" />
          <span className="size-1.5 rounded-full bg-current/80" />
          <span className="size-1.5 rounded-full bg-current/60" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold",
        badgeToneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

function SearchPill() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#dfe7e2] bg-[#fafcfb] px-2.5 py-2 text-[10px] text-[#6f8177]">
      <Search className="size-3.5 text-[#7b8f84]" />
      <span className="truncate">Cari perusahaan atau posisi...</span>
    </div>
  );
}

function TrackerCard() {
  return (
    <HeroCard className="p-4">
      <CardHeader icon={Briefcase} title="Lamaran Saya" chip="24 aktif" />
      <SearchPill />

      <div className="mb-3 flex items-center gap-2 text-[10px] text-[#607168]">
        <span className="rounded-full border border-[#dbe4de] bg-white px-2 py-1 font-medium text-[#246545]">
          Semua
        </span>
        <span className="rounded-full border border-transparent bg-[#eff4f1] px-2 py-1">
          Remote
        </span>
        <span className="rounded-full border border-transparent bg-[#eff4f1] px-2 py-1">
          Minggu ini
        </span>
      </div>

      <div className="space-y-2.5">
        {applications.map((item) => (
          <div
            key={`${item.company}-${item.role}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#e6ece8] bg-[#fcfdfc] px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-[#274337]">
                {item.company}
              </p>
              <p className="truncate text-[10px] text-[#718179]">{item.role}</p>
            </div>
            <StatusBadge tone={item.tone}>{item.stage}</StatusBadge>
          </div>
        ))}
      </div>
    </HeroCard>
  );
}

function BoardCard() {
  return (
    <HeroCard>
      <CardHeader icon={LayoutGrid} title="Status Tracker" chip="Kanban" />
      <div className="grid grid-cols-3 gap-2">
        {pipeline.map((column) => (
          <div
            key={column.title}
            className="rounded-2xl border border-[#e4ebe6] bg-[#fafcfb] p-2.5"
          >
            <div className="mb-2 flex items-center justify-between">
              <StatusBadge tone={column.tone}>{column.title}</StatusBadge>
              <span className="text-[10px] font-semibold text-[#617168]">
                {column.count}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-[#e4ece6]" />
              <div className="h-1.5 w-4/5 rounded-full bg-[#e8eee9]" />
              <div className="h-1.5 w-2/3 rounded-full bg-[#edf2ee]" />
            </div>
          </div>
        ))}
      </div>
    </HeroCard>
  );
}

function AnalyticsCard() {
  return (
    <HeroCard>
      <CardHeader icon={BarChart3} title="Insight Karier" chip="30 hari" />
      <div className="mb-3 grid grid-cols-3 gap-2">
        {analytics.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#e5ebe7] bg-[#fafcfb] p-2"
          >
            <p className="text-[10px] text-[#73827a]">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-[#264437]">
              {item.value}
            </p>
            <p className="mt-1 text-[10px] text-[#7b8a82]">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="flex h-16 items-end gap-1.5 rounded-2xl border border-[#e4ebe6] bg-[#fbfcfb] px-2.5 pb-2.5 pt-4">
        {analyticsBars.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className="flex-1 rounded-full bg-[#dce9e0]"
            style={{
              height: `${value}%`,
              backgroundColor: index === analyticsBars.length - 1 ? "#246545" : undefined,
              opacity: index === analyticsBars.length - 1 ? 1 : 0.85,
            }}
          />
        ))}
      </div>
    </HeroCard>
  );
}

function CVPreviewCard() {
  return (
    <HeroCard className="p-4">
      <CardHeader icon={UserRound} title="CV Builder" chip="Draft 03" />
      <div className="rounded-[20px] border border-[#e3eae5] bg-[#fbfcfb] p-3">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-[#e7f0ea] text-[#246545]">
            <UserRound className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[#264437]">
              Nabila Putri
            </p>
            <p className="truncate text-[10px] text-[#708178]">
              Product Designer
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#eef4f0] px-2 py-1 text-[10px] text-[#587165]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="rounded-2xl border border-[#e6ece8] bg-white px-2.5 py-2">
            <div className="mb-1.5 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-[#2a4438]">Pengalaman</span>
              <span className="text-[#76867d]">2022 - Sekarang</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#e4ebe6]" />
            <div className="mt-1.5 h-1.5 w-5/6 rounded-full bg-[#edf2ee]" />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-[#e6ece8] bg-white px-2.5 py-2 text-[10px] text-[#64766c]">
            <div className="h-8 w-1 rounded-full bg-[#246545]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 w-2/3 rounded-full bg-[#dfe8e2]" />
              <div className="h-1.5 w-4/5 rounded-full bg-[#e9efeb]" />
            </div>
          </div>
        </div>
      </div>
    </HeroCard>
  );
}

function CoverLetterCard() {
  return (
    <HeroCard>
      <CardHeader icon={FileText} title="Surat Lamaran" chip="Template" />
      <div className="rounded-[20px] border border-[#e3ebe5] bg-[#fcfdfc] p-3">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-[#eef4f0] px-2 py-1 text-[10px] font-medium text-[#246545]">
            Personalize
          </span>
          <span className="rounded-full bg-[#f4f5ef] px-2 py-1 text-[10px] text-[#7d7f63]">
            ATS tone
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="h-1.5 w-2/5 rounded-full bg-[#dfe8e1]" />
          <div className="h-1.5 rounded-full bg-[#e6ede8]" />
          <div className="h-1.5 rounded-full bg-[#e9efea]" />
          <div className="h-1.5 w-11/12 rounded-full bg-[#e9efea]" />
          <div className="h-1.5 w-4/5 rounded-full bg-[#edf2ee]" />
          <div className="pt-2">
            <div className="flex items-center justify-between rounded-2xl border border-[#e6ece8] bg-white px-2.5 py-2 text-[10px]">
              <span className="font-medium text-[#5a6d61]">Final paragraph</span>
              <ArrowUpRight className="size-3.5 text-[#246545]" />
            </div>
          </div>
        </div>
      </div>
    </HeroCard>
  );
}

function DocumentStorageCard() {
  return (
    <HeroCard>
      <CardHeader icon={FolderOpen} title="Penyimpanan Dokumen" chip="12 file" />
      <div className="space-y-2">
        {documents.map((file) => (
          <div
            key={file.name}
            className="flex items-center gap-3 rounded-2xl border border-[#e4ebe6] bg-[#fcfdfc] px-3 py-2.5"
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-2xl border",
                badgeToneClasses[file.tone],
              )}
            >
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-[#274337]">
                {file.name}
              </p>
              <p className="text-[10px] text-[#75847c]">{file.meta}</p>
            </div>
            <MoreHorizontal className="size-4 text-[#8a9a91]" />
          </div>
        ))}
      </div>
    </HeroCard>
  );
}

function PortfolioCard() {
  return (
    <HeroCard className="p-4">
      <CardHeader icon={LayoutGrid} title="Portofolio Digital" chip="2 project" />
      <div className="space-y-2.5">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className="rounded-[20px] border border-[#e4ebe7] bg-[#fcfdfc] p-2.5"
          >
            <div className="mb-2 h-16 rounded-2xl bg-[#edf3ee] p-2">
              <div className="flex h-full items-end gap-1.5">
                <div className="h-6 w-1/4 rounded-md bg-[#d9e7dc]" />
                <div className="h-10 w-1/3 rounded-md bg-[#cfe0d4]" />
                <div className="h-8 flex-1 rounded-md bg-[#246545]/85" />
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-[#264437]">
                  {project.title}
                </p>
                <p className="text-[10px] text-[#718179]">{project.subtitle}</p>
              </div>
              <span className="rounded-full border border-[#dbe5de] bg-white px-2 py-1 text-[10px] text-[#246545]">
                {index === 0 ? "Featured" : "Live"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </HeroCard>
  );
}

function JobCard() {
  return (
    <HeroCard>
      <CardHeader icon={Briefcase} title="Lowongan Tersimpan" chip="3 cocok" />
      <div className="rounded-[20px] border border-[#e3ebe5] bg-[#fbfcfb] p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold text-[#264437]">
              Senior Product Designer
            </p>
            <p className="text-[10px] text-[#72827a]">Mekari / Jakarta</p>
          </div>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-xl border border-[#e0e8e2] bg-white text-[#246545]"
            aria-label="Simpan lowongan"
          >
            <Bookmark className="size-3.5 fill-current" />
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <StatusBadge tone="emerald">Remote</StatusBadge>
          <StatusBadge tone="slate">Full-time</StatusBadge>
          <StatusBadge tone="amber">Priority</StatusBadge>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#e5ebe7] bg-white px-3 py-2 text-[10px]">
          <div>
            <p className="font-medium text-[#294438]">Deadline 4 hari lagi</p>
            <p className="text-[#76857d]">Disimpan dari KarirKit Jobs</p>
          </div>
          <ArrowUpRight className="size-3.5 text-[#246545]" />
        </div>
      </div>
    </HeroCard>
  );
}

function TimelineCard() {
  return (
    <HeroCard>
      <CardHeader icon={Clock3} title="Progress Proses" chip="On track" />
      <div className="space-y-2.5">
        {timelineSteps.map((step, index) => (
          <div key={step.title} className="flex items-center gap-3">
            <div className="relative flex size-6 shrink-0 items-center justify-center">
              <div
                className={cn(
                  "size-6 rounded-full border",
                  step.done
                    ? "border-[#246545] bg-[#246545] text-white"
                    : "border-[#d7e2db] bg-white text-[#8ca097]",
                )}
              >
                <div className="flex h-full items-center justify-center">
                  {step.done ? <Check className="size-3.5" /> : null}
                </div>
              </div>
              {index !== timelineSteps.length - 1 ? (
                <div className="absolute top-6 h-5 w-px bg-[#d8e2dc]" />
              ) : null}
            </div>
            <div className="flex-1 rounded-2xl border border-[#e5ebe7] bg-[#fbfcfb] px-3 py-2">
              <p className="text-[11px] font-semibold text-[#274337]">
                {step.title}
              </p>
              <p className="text-[10px] text-[#74847b]">
                {step.done ? "Selesai" : "Menunggu feedback recruiter"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </HeroCard>
  );
}

export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-5",
        className,
      )}
    >
      <div className="relative lg:hidden">
        <div className="grid gap-3 sm:grid-cols-2">
          <TrackerCard />
          <CVPreviewCard />
          <DocumentStorageCard />
          <PortfolioCard />
          <div className="hidden sm:block">
            <AnalyticsCard />
          </div>
          <div className="hidden sm:block">
            <TimelineCard />
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[540px] lg:block xl:min-h-[580px]">
        <div className="absolute left-0 top-14 z-10 w-[220px] rotate-[-2.5deg] xl:w-[240px]">
          <JobCard />
        </div>

        <div className="absolute left-[7%] top-[225px] z-0 w-[240px] rotate-[1.4deg] xl:w-[260px]">
          <AnalyticsCard />
        </div>

        <div className="absolute bottom-6 left-[5%] z-10 w-[260px] rotate-[-1.4deg] xl:w-[280px]">
          <DocumentStorageCard />
        </div>

        <div className="absolute left-[25%] top-1 z-10 w-[230px] rotate-[-1deg] xl:w-[250px]">
          <CoverLetterCard />
        </div>

        <div className="absolute left-1/2 top-16 z-20 w-[340px] -translate-x-1/2 xl:w-[372px]">
          <TrackerCard />
        </div>

        <div className="absolute bottom-0 left-[33%] z-10 w-[260px] rotate-[1.5deg] xl:w-[280px]">
          <BoardCard />
        </div>

        <div className="absolute right-[18%] top-3 z-10 w-[250px] rotate-[1.8deg] xl:w-[270px]">
          <CVPreviewCard />
        </div>

        <div className="absolute right-0 top-[136px] z-0 w-[250px] rotate-[2.2deg] xl:w-[272px]">
          <PortfolioCard />
        </div>

        <div className="absolute bottom-8 right-[11%] z-10 w-[255px] rotate-[-1.3deg] xl:w-[275px]">
          <TimelineCard />
        </div>
      </div>
    </div>
  );
}
