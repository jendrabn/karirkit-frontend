import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { type DocumentTemplate } from "@/types/template";

interface TemplatePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: DocumentTemplate | null;
}

export function TemplatePreviewModal({
  open,
  onOpenChange,
  template,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <div className="flex flex-col max-h-[90vh]">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>{template.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-2 pb-6">
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-auto rounded-lg border border-border shadow-xs"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
