import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateGridModal } from "./template-grid-modal";
import { type DocumentTemplate } from "@/types/template";
import { buildImageUrl, cn } from "@/lib/utils";

interface TemplateSelectorProps {
  templates: DocumentTemplate[];
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export function TemplateSelector({
  templates,
  value,
  onChange,
  hasError,
  disabled,
}: TemplateSelectorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const selectedTemplate = templates.find((t) => t.id === value);
  const canOpen = !disabled;

  return (
    <div className="space-y-2">
      {selectedTemplate ? (
        <div
          className={cn(
            "group relative aspect-[3/4] max-w-[200px] cursor-pointer overflow-hidden rounded-lg border-2",
            hasError ? "border-destructive" : "border-primary",
            disabled && "cursor-not-allowed opacity-60",
          )}
          onClick={() => {
            if (!canOpen) return;
            setModalOpen(true);
          }}
        >
          <img
            src={buildImageUrl(selectedTemplate.preview)}
            alt={selectedTemplate.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-sm font-medium text-white">
              Ganti Template
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="truncate text-xs font-medium text-white">
              {selectedTemplate.name}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "aspect-[3/4] max-w-[200px] w-full",
            disabled && "cursor-not-allowed",
          )}
          onClick={() => {
            if (!canOpen) return;
            setModalOpen(true);
          }}
        >
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-full w-full border-dashed flex-col gap-2 hover:bg-muted/50",
              hasError && "border-destructive",
              disabled && "hover:bg-transparent",
            )}
          >
            <FileText className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Pilih Template
            </span>
          </Button>
        </div>
      )}

      {selectedTemplate && (
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={() => {
            if (!canOpen) return;
            setModalOpen(true);
          }}
          disabled={disabled}
        >
          Lihat semua template
        </Button>
      )}

      <TemplateGridModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        templates={templates}
        value={value}
        onSelect={onChange}
      />
    </div>
  );
}
