import { FileText } from "lucide-react";

export function TemplateActionButtonContent() {
  return (
    <>
      <FileText
        data-icon="inline-start"
        className="hidden min-[480px]:block"
      />
      <span className="min-[480px]:hidden">Template</span>
      <span className="hidden min-[480px]:inline">Gunakan Template</span>
    </>
  );
}
