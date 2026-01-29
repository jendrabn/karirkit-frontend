import { Button } from "@/components/ui/button";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { getContactLink, formatValue } from "@/lib/utils";

// ============================================
// INFO ITEM COMPONENT
// ============================================

type InfoItemProps = {
  label: string;
  value?: string | number | null;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

/**
 * Display information item with optional icon
 *
 * @example
 * <InfoItem label="Nama" value={user.name} icon={User} />
 * <InfoItem label="Email" value={user.email} icon={Mail} />
 */
export const InfoItem = ({
  label,
  value,
  icon: Icon,
  className = "",
}: InfoItemProps) => {
  const displayValue = formatValue(value);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-sm font-medium pl-6">{displayValue}</p>
    </div>
  );
};

// ============================================
// CONTACT ITEM COMPONENT
// ============================================

type ContactItemProps = {
  type: "email" | "phone" | "url";
  value?: string | null;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

/**
 * Display contact item with clickable icon button
 * Phone links open WhatsApp, emails open mail client, URLs open in new tab
 *
 * @example
 * <ContactItem type="email" value={user.email} label="Email" icon={Mail} />
 * <ContactItem type="phone" value={user.phone} label="WhatsApp" icon={Phone} />
 * <ContactItem type="url" value={company.website} label="Website" icon={ExternalLink} />
 */
export const ContactItem = ({
  type,
  value,
  label,
  icon: Icon,
  className = "",
}: ContactItemProps) => {
  if (!value || value.trim() === "") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
        </div>
        <p className="text-sm text-muted-foreground italic pl-6">-</p>
      </div>
    );
  }

  const LinkIcon =
    type === "email" ? Mail : type === "phone" ? Phone : ExternalLink;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      </div>
      <div className="flex items-center gap-2 pl-6">
        <p className="text-sm font-medium truncate flex-1">{value}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          asChild
        >
          <a
            href={getContactLink(type, value)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span className="sr-only">Buka {label}</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

// ============================================
// RICH TEXT COMPONENT
// ============================================

type RichTextProps = {
  content?: string | null;
  className?: string;
  emptyText?: string;
};

/**
 * Render rich text content (HTML or plain text)
 * Automatically detects HTML and renders accordingly
 *
 * @example
 * <RichText content={blog.content} />
 * <RichText content={user.bio} emptyText="Belum ada bio" />
 */
export const RichText = ({
  content,
  className = "",
  emptyText = "Tidak ada data",
}: RichTextProps) => {
  if (!content || !content.trim()) {
    return (
      <p className={`text-sm text-muted-foreground italic ${className}`}>
        {emptyText}
      </p>
    );
  }

  const trimmed = content.trim();
  const looksLikeHtml = /<[^>]+>/.test(trimmed);

  if (looksLikeHtml) {
    return (
      <div
        className={`prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-headings:font-semibold ${className}`}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

  return (
    <p className={`text-sm leading-relaxed whitespace-pre-line ${className}`}>
      {trimmed}
    </p>
  );
};
