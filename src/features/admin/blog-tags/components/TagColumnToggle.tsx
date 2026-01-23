import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TagColumnVisibility {
  name: boolean;
  slug: boolean;
  blog_count: boolean;
  created_at: boolean;
  updated_at: boolean;
}

const columnLabels: Record<keyof TagColumnVisibility, string> = {
  name: "Nama Tag",
  slug: "Slug",
  blog_count: "Jumlah Blog",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

interface TagColumnToggleProps {
  visibility: TagColumnVisibility;
  onVisibilityChange: (visibility: TagColumnVisibility) => void;
}

export function TagColumnToggle({
  visibility,
  onVisibilityChange,
}: TagColumnToggleProps) {
  const toggleColumn = (column: keyof TagColumnVisibility) => {
    onVisibilityChange({
      ...visibility,
      [column]: !visibility[column],
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 z-50 bg-popover max-h-80 overflow-y-auto"
      >
        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(visibility) as (keyof TagColumnVisibility)[]).map(
          (column) => (
            <DropdownMenuCheckboxItem
              key={column}
              checked={visibility[column]}
              onCheckedChange={() => toggleColumn(column)}
            >
              {columnLabels[column]}
            </DropdownMenuCheckboxItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
