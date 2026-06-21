import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { buildImageUrl } from "@/lib/utils";
import { dayjs } from "@/lib/date";
import type { ApplicationLetter } from "@/features/application-letters/api/get-application-letters";

interface ApplicationLetterDetailProps {
  letter: ApplicationLetter;
}

const labels = {
  id: {
    subject: "Perihal",
    recipient: "Kepada Yth.",
    atPlace: "di tempat",
    greeting: "Dengan hormat,",
    attachment: "Lampiran:",
    closing: "Hormat saya,",
    signatureAlt: "Tanda tangan",
  },
  en: {
    subject: "Subject",
    recipient: "To,",
    atPlace: "",
    greeting: "Dear Sir/Madam,",
    attachment: "Attachment:",
    closing: "Sincerely,",
    signatureAlt: "Signature",
  },
} as const;

export function ApplicationLetterDetail({
  letter,
}: ApplicationLetterDetailProps) {
  const lang = letter.language === "en" ? "en" : "id";
  const t = labels[lang];

  return (
    <div className="mx-auto max-w-[210mm]">
      <div className="bg-white shadow-xl ring-1 ring-black/5 rounded-sm overflow-hidden">
        <div className="px-10 py-12 sm:px-14 sm:py-16 space-y-6">
          {/* Place & Date */}
          <div className="text-right text-sm text-neutral-500">
            {letter.applicant_city},{" "}
            {letter.application_date
              ? dayjs(letter.application_date).format("DD MMMM YYYY")
              : ""}
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.15em] text-neutral-400">
              {t.subject}
            </span>
            <p className="text-base font-semibold text-neutral-900 underline underline-offset-4 decoration-neutral-300">
              {letter.subject}
            </p>
          </div>

          {/* Recipient */}
          <div className="space-y-0.5 text-sm text-neutral-700">
            <p className="font-medium">{t.recipient}</p>
            <p className="font-medium">{letter.receiver_title}</p>
            <p>{letter.company_name}</p>
            {letter.company_address && <p>{letter.company_address}</p>}
            {letter.company_city && <p>{letter.company_city}</p>}
            {t.atPlace && <p className="mt-4 text-neutral-500">{t.atPlace}</p>}
          </div>

          {/* Opening */}
          <div className="space-y-4 text-sm leading-relaxed text-neutral-700">
            <p>{t.greeting}</p>
            <div
              dangerouslySetInnerHTML={{ __html: letter.opening_paragraph }}
            />
          </div>

          {/* Body */}
          {letter.body_paragraph && (
            <div
              className="text-sm leading-relaxed text-neutral-700"
              dangerouslySetInnerHTML={{ __html: letter.body_paragraph }}
            />
          )}

          {/* Closing */}
          <div
            className="text-sm leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: letter.closing_paragraph }}
          />

          {/* Attachments */}
          {letter.attachments && (
            <div className="text-sm text-neutral-700">
              <span className="font-medium">{t.attachment} </span>
              <span>{letter.attachments}</span>
            </div>
          )}

          {/* Closing salutation */}
          <div className="text-sm text-neutral-700">
            <p>{t.closing}</p>
          </div>

          {/* Signature & Name */}
          <div className="space-y-1">
            {letter.signature && (
              <img
                src={buildImageUrl(letter.signature)}
                alt={t.signatureAlt}
                className="h-16 object-contain"
              />
            )}
            <p className="font-semibold text-neutral-800">{letter.name}</p>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Contact Footer */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {letter.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {letter.phone}
            </span>
            {letter.address && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {letter.address}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
