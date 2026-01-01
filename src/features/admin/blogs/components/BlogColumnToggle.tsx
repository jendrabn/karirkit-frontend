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

export interface ColumnVisibility {
  title: boolean;
  category: boolean;
  author: boolean;
  status: boolean;
  views_count: boolean;
  min_read: boolean;
  published_at: boolean;
  slug: boolean;
  tags: boolean;
  created_at: boolean;
  updated_at: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  title: true,
  category: true,
  author: true,
  status: true,
  views_count: true,
  min_read: false,
  published_at: true,
  slug: false,
  tags: false,
  created_at: true,
  updated_at: false,
};

const columnLabels: Record<keyof ColumnVisibility, string> = {
  title: "Judul",
  category: "Kategori",
  author: "Penulis",
  status: "Status",
  views_count: "Views",
  min_read: "Waktu Baca",
  published_at: "Tanggal Publish",
  slug: "Slug",
  tags: "Tags",
  created_at: "Dibuat",
  updated_at: "Diperbarui",
};

const columnOrder: (keyof ColumnVisibility)[] = [
  "title",
  "category",
  "author",
  "status",
  "views_count",
  "min_read",
  "published_at",
  "slug",
  "tags",
  "created_at",
  "updated_at",
];

interface BlogColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function BlogColumnToggle({
  visibility,
  onVisibilityChange,
}: BlogColumnToggleProps) {
  const toggleColumn = (column: keyof ColumnVisibility) => {
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
