import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplatePreviewModal } from "./template-preview-modal";
import { DocumentTemplate } from "@/data/documentTemplates";

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const selectedTemplate = templates.find((t) => t.id === value) || null;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Pilih template" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setPreviewOpen(true)}
          disabled={!value}
          title="Lihat Contoh Template"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      <TemplatePreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={selectedTemplate}
      />
    </div>
  );
}
