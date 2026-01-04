import { useState } from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type DocumentTemplate } from "@/types/template";

interface TemplateGridModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: DocumentTemplate[];
  value: string;
  onSelect: (templateId: string) => void;
  title?: string;
  description?: string;
}

export function TemplateGridModal({
  open,
  onOpenChange,
  templates,
  value,
  onSelect,
  title = "Pilih Template",
  description = "Template yang dipilih akan secara otomatis dilengkapi dengan informasi yang tersedia pada profil Anda.",
}: TemplateGridModalProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const handleSelect = (templateId: string) => {
    onSelect(templateId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl p-0 gap-0">
        <div className="flex max-h-[85vh] flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 text-center">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2 pb-6">
            <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3 lg:grid-cols-4">
              {templates.map((template) => {
                const isSelected = value === template.id;
                const isHovered = hoveredId === template.id;

                return (
                  <div
                    key={template.id}
                    className={cn(
                      "group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                    onMouseEnter={() => setHoveredId(template.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleSelect(template.id)}
                  >
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />

                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                        isHovered || isSelected ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <Button
                        size="sm"
                        className={cn("transition-all", isSelected && "bg-primary")}
                      >
                        {isSelected ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Terpilih
                          </>
                        ) : (
                          "Pilih template"
                        )}
                      </Button>
                    </div>

                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="truncate text-sm font-medium text-white">
                        {template.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="border-t bg-muted/30 px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
