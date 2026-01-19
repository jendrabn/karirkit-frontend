import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateGridModal } from "./template-grid-modal";
import { type DocumentTemplate } from "@/types/template";
import { buildImageUrl } from "@/lib/utils";

interface TemplateSelectorProps {
  templates: DocumentTemplate[];
  value: string;
  onChange: (value: string) => void;
}

export function TemplateSelector({
  templates,
  value,
  onChange,
}: TemplateSelectorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const selectedTemplate = templates.find((t) => t.id === value);

  return (
    <div className="space-y-2">
      {selectedTemplate ? (
        <div
          className="group relative aspect-[3/4] max-w-[200px] cursor-pointer overflow-hidden rounded-lg border-2 border-primary"
          onClick={() => setModalOpen(true)}
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
          className="aspect-[3/4] max-w-[200px] w-full"
          onClick={() => setModalOpen(true)}
        >
          <Button
            type="button"
            variant="outline"
            className="h-full w-full border-dashed flex-col gap-2 hover:bg-muted/50"
          >
            <FileText className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Pilih Template
            </span>
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-sm"
        onClick={() => setModalOpen(true)}
      >
        {selectedTemplate ? "Lihat semua template" : ""}
      </Button>

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
