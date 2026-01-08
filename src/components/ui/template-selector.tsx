import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TemplateGridModal } from "./template-grid-modal";
import { type DocumentTemplate } from "@/types/template";
import { buildImageUrl } from "@/lib/utils";

interface TemplateSelectorProps {
  label: string;
  templates: DocumentTemplate[];
  value: string;
  onChange: (value: string) => void;
}

export function TemplateSelector({
  label,
  templates,
  value,
  onChange,
}: TemplateSelectorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const selectedTemplate = templates.find((t) => t.id === value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

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
        <Button
          type="button"
          variant="outline"
          className="h-24 w-full border-dashed"
          onClick={() => setModalOpen(true)}
        >
          <FileText className="mr-2 h-6 w-6" />
          Pilih Template
        </Button>
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
