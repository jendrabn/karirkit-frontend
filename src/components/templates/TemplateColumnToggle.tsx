import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns3 } from "lucide-react";

interface TemplateColumnToggleProps {
  visibleColumns: {
    preview_image: boolean;
    type: boolean;
    name: boolean;
    is_premium: boolean;
    is_active: boolean;
    created_at: boolean;
  };
  onToggle: (column: keyof TemplateColumnToggleProps["visibleColumns"]) => void;
}

const columnLabels: Record<keyof TemplateColumnToggleProps["visibleColumns"], string> = {
  preview_image: "Preview",
  name: "Nama",
  type: "Tipe",
  is_premium: "Premium",
  is_active: "Status",
  created_at: "Dibuat",
};

export function TemplateColumnToggle({ visibleColumns, onToggle }: TemplateColumnToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Columns3 className="h-4 w-4 mr-2" />
          Kolom
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(visibleColumns) as Array<keyof typeof visibleColumns>).map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visibleColumns[column]}
            onCheckedChange={() => onToggle(column)}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
