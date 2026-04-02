import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Ellipsis,
  Eye,
  FileText,
  Filter,
  Globe,
  GripHorizontal,
  LayoutTemplate,
  Link2,
  Plus,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FeatureIllustrationVariant =
  | "application"
  | "applicationletter"
  | "cv"
  | "portfolio"
  | "documents";

interface FeatureIllustrationProps {
  variant: FeatureIllustrationVariant;
  className?: string;
}

const applicationRows = [
  {
    company: "Astra Tech",
    role: "Frontend Engineer",
    date: "12 Apr",
    status: "Applied",
    statusClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100/60",
    progress: "w-[32%]",
  },
  {
    company: "Ruang Data",
    role: "Product Designer",
    date: "16 Apr",
    status: "Interview",
    statusClass:
      "border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100/60",
    progress: "w-[68%]",
  },
  {
    company: "Nusa Works",
    role: "UI Engineer",
    date: "18 Apr",
    status: "Offer",
    statusClass: "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-100/60",
    progress: "w-[88%]",
  },
];

const portfolioTags = ["React", "Tailwind", "Figma"];
const cvSkills = ["React", "TypeScript", "UI Design"];

export function FeatureIllustration({
  variant,
  className,
}: FeatureIllustrationProps) {
  return (
    <div aria-hidden="true" className={cn("relative mx-auto w-full max-w-[34rem]", className)}>
      <div className="relative">
        {variant === "application" && <ApplicationTrackerIllustration />}
        {variant === "applicationletter" && <ApplicationLetterIllustration />}
        {variant === "cv" && <CvBuilderIllustration />}
        {variant === "portfolio" && <PortfolioIllustration />}
        {variant === "documents" && <DocumentsIllustration />}
      </div>
    </div>
  );
}

function ApplicationTrackerIllustration() {
  return (
    <div className="space-y-3">
      <MiniWindow
        title="Lamaran Kerja"
        icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6f8477]" />
              <div className="h-8 rounded-xl border border-[#d8e5dc] bg-white pl-7 pr-3 text-[11px] leading-8 text-[#7a8d81] shadow-sm">
                Cari perusahaan atau posisi
              </div>
            </div>
            <div className="flex h-8 items-center gap-1 rounded-xl border border-[#d8e5dc] bg-white px-2.5 text-[11px] font-medium text-[#446552] shadow-sm">
              <Filter className="h-3 w-3" />
              Filter
            </div>
          </div>

          <div className="flex gap-2">
            <Chip>Remote</Chip>
            <Chip>Pending</Chip>
            <Chip>Follow-up</Chip>
          </div>

          <div className="rounded-2xl border border-[#dce8df] bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#234f39]">
                  Progress Pipeline
                </div>
                <div className="text-[10px] text-[#7b8e82]">
                  9 lamaran aktif minggu ini
                </div>
              </div>
              <div className="rounded-full bg-[#ecf5ef] px-2 py-1 text-[10px] font-semibold text-[#246545]">
                68%
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {["Applied", "Screening", "Interview", "Offer"].map(
                (step, index) => (
                  <div key={step} className="space-y-1">
                    <div className="h-1.5 rounded-full bg-[#e4eee8]">
                      <div
                        className={cn(
                          "h-1.5 rounded-full bg-[#246545]",
                          index < 3 ? "w-full" : "w-2/3",
                        )}
                      />
                    </div>
                    <div className="text-[9px] font-medium text-[#6f8477]">
                      {step}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            {applicationRows.map((item) => (
              <div
                key={item.company}
                className="rounded-2xl border border-[#dce8df] bg-white p-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-[4px] border border-[#cfe0d4] bg-[#f5faf7]" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[11px] font-semibold text-[#1e3427]">
                          {item.company}
                        </div>
                        <div className="truncate text-[10px] text-[#71867a]">
                          {item.role}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "rounded-full border px-2 py-1 text-[9px] font-semibold shadow-sm",
                          item.statusClass,
                        )}
                      >
                        {item.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-[#e7efe9]">
                        <div
                          className={cn(
                            "h-1.5 rounded-full bg-[#246545]",
                            item.progress,
                          )}
                        />
                      </div>
                      <div className="shrink-0 text-[9px] text-[#7d9084]">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MiniWindow>
    </div>
  );
}

function ApplicationLetterIllustration() {
  return (
    <div className="relative pt-12">
      <div className="absolute left-3 top-0 w-[44%] rounded-2xl border border-[#dbe7de] bg-white p-3 shadow-[0_18px_30px_-24px_rgba(36,101,69,0.4)]">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#edf5ef] text-[#246545]">
            <LayoutTemplate className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-[#1e3427]">
              Template Surat
            </div>
            <div className="text-[9px] text-[#7c9084]">Bahasa Indonesia</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <TemplateThumb active label="Formal" />
          <TemplateThumb label="Modern" />
        </div>
      </div>

      <MiniWindow
        title="Editor Surat Lamaran"
        icon={<FileText className="h-3.5 w-3.5" />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#dce8df] bg-white px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-[#496957]">
              <MiniToolbarButton label="T" />
              <MiniToolbarButton label="B" bold />
              <MiniToolbarButton label="U" />
              <MiniToolbarButton
                icon={<GripHorizontal className="h-3 w-3" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-[#d4e3d8] bg-[#f7faf8] px-2 py-1 text-[10px] font-medium text-[#587364]">
                Template
              </div>
              <div className="rounded-full bg-[#246545] px-2.5 py-1 text-[10px] font-semibold text-white">
                Generate
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#dce8df] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-[#eff6f1] px-2 py-1 text-[10px] font-semibold text-[#246545]">
                Subject
              </div>
              <div className="h-2 w-24 rounded-full bg-[#edf1ee]" />
              <div className="rounded-full border border-[#d6e3d9] px-2 py-1 text-[9px] text-[#688072]">
                PT Karir Nusantara
              </div>
            </div>

            <div className="space-y-2.5">
              <ParagraphLine width="w-24" />
              <ParagraphLine width="w-full" />
              <ParagraphLine width="w-[88%]" />
              <ParagraphLine width="w-[92%]" />
              <ParagraphLine width="w-[76%]" />
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-[#cfe0d4] bg-[#f8fbf9] p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold text-[#2d503c]">
                  Paragraf Siap Pakai
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#eef6f0] px-2 py-1 text-[9px] font-semibold text-[#246545]">
                  <Sparkles className="h-3 w-3" />
                  Opening
                </div>
              </div>
              <div className="space-y-1.5">
                <ParagraphLine width="w-full" />
                <ParagraphLine width="w-[80%]" />
              </div>
            </div>
          </div>
        </div>
      </MiniWindow>
    </div>
  );
}

function CvBuilderIllustration() {
  return (
    <div className="relative pt-10">
      <div className="absolute right-2 top-0 z-10 w-[46%] rounded-2xl border border-[#d9e7dd] bg-white p-3 shadow-[0_18px_32px_-24px_rgba(36,101,69,0.4)]">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[#1e3427]">
            Visibility
          </div>
          <Globe className="h-3.5 w-3.5 text-[#246545]" />
        </div>
        <div className="mb-2 flex gap-2">
          <Chip strong>Public</Chip>
          <Chip>EN</Chip>
        </div>
        <div className="rounded-xl border border-[#dce8df] bg-[#f8fbf9] px-2.5 py-2 text-[9px] text-[#6f8477]">
          karirkit.app/cv/raka-ui
        </div>
      </div>

      <MiniWindow title="CV Preview" icon={<FileText className="h-3.5 w-3.5" />}>
        <div className="rounded-[24px] border border-[#dce8df] bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f2eb] text-sm font-bold text-[#246545]">
              RK
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-[#183224]">
                Raka Pratama
              </div>
              <div className="text-[10px] text-[#6f8477]">
                Frontend Developer
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cvSkills.map((skill) => (
                  <div
                    key={skill}
                    className="rounded-full border border-[#d7e4da] bg-[#f7faf8] px-2 py-1 text-[9px] font-medium text-[#52705f]"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#e2ece5] bg-[#fbfdfc] p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f8477]">
                Experience
              </div>
              <div className="space-y-2">
                <CvRow title="Frontend Engineer" subtitle="Astra Tech" />
                <CvRow title="UI Developer" subtitle="Karir Studio" />
              </div>
            </div>
            <div className="rounded-2xl border border-[#e2ece5] bg-[#fbfdfc] p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f8477]">
                Education
              </div>
              <div className="space-y-2">
                <CvRow
                  title="S1 Informatika"
                  subtitle="Universitas Indonesia"
                />
                <CvRow title="12 skills" subtitle="3 sertifikat" compact />
              </div>
            </div>
          </div>
        </div>
      </MiniWindow>
    </div>
  );
}

function PortfolioIllustration() {
  return (
    <div className="relative pt-10">
      <div className="absolute left-4 top-0 z-10 w-[42%] rounded-2xl border border-[#d9e7dd] bg-white p-3 shadow-[0_18px_32px_-24px_rgba(36,101,69,0.36)]">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[#244a36]">
            Public Link
          </div>
          <Link2 className="h-3.5 w-3.5 text-[#246545]" />
        </div>
        <div className="rounded-xl border border-[#dce8df] bg-[#f8fbf9] px-2.5 py-2 text-[9px] text-[#6d8378]">
          karirkit.app/u/raka
        </div>
      </div>

      <MiniWindow
        title="Portfolio Project"
        icon={<Eye className="h-3.5 w-3.5" />}
      >
        <div className="rounded-[24px] border border-[#dce8df] bg-white p-3 shadow-sm">
          <div className="relative overflow-hidden rounded-2xl border border-[#d9e6dd] bg-[#eef5f0] p-3">
            <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#246545] shadow-sm">
              Personal
            </div>
            <div className="h-24 rounded-xl bg-[linear-gradient(135deg,#dfeee4_0%,#f8fbf9_50%,#d2e6d9_100%)]">
              <div className="grid h-full grid-cols-3 gap-2 p-3">
                <div className="rounded-lg bg-white/70" />
                <div className="rounded-lg bg-white/90" />
                <div className="rounded-lg bg-white/60" />
              </div>
            </div>
          </div>

          <div className="space-y-3 px-1 pb-1 pt-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[12px] font-semibold text-[#193324]">
                  KarirKit Portfolio
                </div>
                <div className="mt-1 text-[10px] text-[#6f8477]">
                  Showcase web app untuk menampilkan studi kasus dan UI system.
                </div>
              </div>
              <div className="rounded-xl border border-[#d9e6dd] bg-[#f8fbf9] p-1.5 text-[#6f8477]">
                <Ellipsis className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#6d8378]">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              <span>Frontend Developer</span>
              <span className="text-[#c3d2c8]">*</span>
              <CalendarDays className="h-3.5 w-3.5" />
              <span>April 2025</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {portfolioTags.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-[#eef6f0] px-2 py-1 text-[9px] font-semibold text-[#246545]"
                >
                  {tag}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MiniActionButton
                icon={<Eye className="h-3 w-3" />}
                label="Preview"
              />
              <MiniActionButton
                icon={<Link2 className="h-3 w-3" />}
                label="Repository"
                subtle
              />
            </div>
          </div>
        </div>
      </MiniWindow>
    </div>
  );
}

function DocumentsIllustration() {
  return (
    <MiniWindow
      title="Penyimpanan Dokumen"
      icon={<Upload className="h-3.5 w-3.5" />}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#70857a]" />
            <div className="h-8 rounded-xl border border-[#d8e5dc] bg-white pl-7 pr-3 text-[11px] leading-8 text-[#7a8d81] shadow-sm">
              Cari dokumen
            </div>
          </div>
          <div className="flex h-8 items-center gap-1 rounded-xl bg-[#246545] px-2.5 text-[10px] font-semibold text-white shadow-sm">
            <Plus className="h-3 w-3" />
            Upload
          </div>
        </div>

        <div className="rounded-2xl border border-[#dce8df] bg-white p-3 shadow-sm">
          <div className="mb-2 text-[10px] font-semibold text-[#244a36]">
            Recent Files
          </div>
          <div className="space-y-2">
            {[
              ["CV-Raka.pdf", "PDF", "1.2 MB"],
              ["Surat-Lamaran.docx", "DOCX", "342 KB"],
              ["Portfolio-Deck.pdf", "PDF", "2.8 MB"],
            ].map(([name, type, size]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl border border-[#e1ebe4] bg-[#fbfdfc] px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf5ef] text-[#246545]">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[10px] font-medium text-[#24392d]">
                    {name}
                  </div>
                  <div className="text-[9px] text-[#789083]">
                    {type} * {size}
                  </div>
                </div>
                <div className="rounded-full bg-[#eef5f0] px-2 py-1 text-[9px] font-semibold text-[#246545]">
                  Ready
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MiniWindow>
  );
}

function MiniWindow({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-[#d8e6dc] bg-[#f3f8f5] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
      <div className="rounded-[22px] border border-[#dde9e0] bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#edf5ef] text-[#246545]">
              {icon}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#193324]">
                {title}
              </div>
              <div className="text-[9px] text-[#7a8e81]">
                KarirKit mini preview
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#dce8df]" />
            <div className="h-2 w-2 rounded-full bg-[#dce8df]" />
            <div className="h-2 w-2 rounded-full bg-[#246545]" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Chip({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-full border px-2 py-1 text-[9px] font-medium shadow-sm",
        strong
          ? "border-[#cce0d3] bg-[#edf6f0] text-[#246545]"
          : "border-[#dbe7de] bg-white text-[#638072]",
      )}
    >
      {children}
    </div>
  );
}

function TemplateThumb({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-2",
        active
          ? "border-[#bcd8c6] bg-[#f3f9f5]"
          : "border-[#e0ebe3] bg-[#fbfdfc]",
      )}
    >
      <div className="mb-2 h-12 rounded-lg bg-[linear-gradient(180deg,#ffffff_0%,#eef4f0_100%)]" />
      <div className="text-[9px] font-semibold text-[#365642]">{label}</div>
    </div>
  );
}

function MiniToolbarButton({
  label,
  icon,
  bold = false,
}: {
  label?: string;
  icon?: ReactNode;
  bold?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg border border-[#dde8e1] bg-[#fbfdfc] text-[10px] text-[#5b7767]",
        bold && "font-bold text-[#244934]",
      )}
    >
      {icon ?? label}
    </div>
  );
}

function ParagraphLine({ width }: { width: string }) {
  return <div className={cn("h-2 rounded-full bg-[#edf1ee]", width)} />;
}

function CvRow({
  title,
  subtitle,
  compact = false,
}: {
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#e3ece6] bg-white p-2.5",
        compact && "bg-[#f8fbf9]",
      )}
    >
      <div className="text-[10px] font-semibold text-[#244734]">{title}</div>
      <div className="text-[9px] text-[#71867b]">{subtitle}</div>
    </div>
  );
}

function MiniActionButton({
  icon,
  label,
  subtle = false,
}: {
  icon: ReactNode;
  label: string;
  subtle?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-semibold shadow-sm",
        subtle
          ? "border border-[#dbe7de] bg-white text-[#557261]"
          : "bg-[#246545] text-white",
      )}
    >
      {icon}
      {label}
    </div>
  );
}
