import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  type ParagraphType,
  type ParagraphTemplate,
  type ParagraphTypeLabels,
} from "@/types/template";
import { paragraphTemplates } from "@/features/application-letters/data/paragraph-templates";

const paragraphTypeLabels: ParagraphTypeLabels = {
  opening: "Paragraf Pembuka",
  body: "Paragraf Isi",
  closing: "Paragraf Penutup",
};

interface ParagraphTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paragraphType: ParagraphType | null;
  currentValue: string;
  onSelectTemplate: (content: string) => void;
  language?: string;
}

export function ParagraphTemplateModal({
  open,
  onOpenChange,
  paragraphType,
  currentValue,
  onSelectTemplate,
  language = "id",
}: ParagraphTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ParagraphTemplate | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!paragraphType) return null;

  const templates = paragraphTemplates[paragraphType].filter(
    (t) =>
      !t.language ||
      t.language === language ||
      (!language && t.language === "id")
  );
  const typeLabel = paragraphTypeLabels[paragraphType];

  const handleSelectTemplate = (template: ParagraphTemplate) => {
    if (currentValue.trim()) {
      setSelectedTemplate(template);
      setShowConfirmDialog(true);
    } else {
      onSelectTemplate(template.content);
      onOpenChange(false);
    }
  };

  const handleConfirmReplace = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.content);
      setShowConfirmDialog(false);
      setSelectedTemplate(null);
      onOpenChange(false);
    }
  };

  const handleCancelReplace = () => {
    setShowConfirmDialog(false);
    setSelectedTemplate(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-7xl p-0 gap-0">
          <div className="flex flex-col max-h-[80vh]">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle>Pilih Template {typeLabel}</DialogTitle>
              <DialogDescription>
                Bagian teks yang berada di dalam tanda [ ] dapat Anda sesuaikan.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto px-6 py-2 pb-6">
              <div className="space-y-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <h4 className="font-medium mb-2">{template.title}</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                      {template.content}
                    </p>
                    <Button variant="link" className="px-0 mt-2 h-auto">
                      Gunakan template ini
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ganti Teks yang Ada?</AlertDialogTitle>
            <AlertDialogDescription>
              Field ini sudah memiliki isi. Apakah Anda yakin ingin mengganti
              dengan template yang dipilih? Teks yang ada akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelReplace}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace}>
              Ya, Ganti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
