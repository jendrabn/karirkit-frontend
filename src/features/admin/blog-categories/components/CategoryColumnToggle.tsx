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

export interface CategoryColumnVisibility {
  name: boolean;
  slug: boolean;
  description: boolean;
  blog_count: boolean;
  created_at: boolean;
  updated_at: boolean;
}

export const defaultCategoryColumnVisibility: CategoryColumnVisibility = {
  name: true,
  slug: true,
  description: false,
  blog_count: true,
  created_at: true,
  updated_at: false,
};

const columnLabels: Record<keyof CategoryColumnVisibility, string> = {
  name: "Nama Kategori",
  slug: "Slug",
  description: "Deskripsi",
  blog_count: "Jumlah Blog",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

const columnOrder: (keyof CategoryColumnVisibility)[] = [
  "name",
  "slug",
  "blog_count",
  "description",
  "created_at",
  "updated_at",
];
interface CategoryColumnToggleProps {
  visibility: CategoryColumnVisibility;
  onVisibilityChange: (visibility: CategoryColumnVisibility) => void;
}

export function CategoryColumnToggle({
  visibility,
  onVisibilityChange,
}: CategoryColumnToggleProps) {
  const toggleColumn = (column: keyof CategoryColumnVisibility) => {
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
        {columnOrder.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visibility[column]}
            onCheckedChange={() => toggleColumn(column)}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
