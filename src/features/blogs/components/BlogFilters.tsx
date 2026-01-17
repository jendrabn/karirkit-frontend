import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import type { GetBlogsParams } from "@/features/blogs/api/get-blogs";

interface BlogFiltersProps {
  filters: GetBlogsParams;
  onFiltersChange: (filters: GetBlogsParams) => void;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

export function BlogFilters({
  filters,
  onFiltersChange,
  categories,
  tags,
}: BlogFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<GetBlogsParams>(filters);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, q: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split("-") as [
      GetBlogsParams["sort_by"],
      "asc" | "desc",
    ];
    onFiltersChange({ ...filters, sort_by, sort_order, page: 1 });
  };

  const handleApplyFilters = () => {
    onFiltersChange({ ...localFilters, page: 1 });
    setOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: GetBlogsParams = {
      page: 1,
      per_page: filters.per_page,
      sort_by: "published_at",
      sort_order: "desc",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setOpen(false);
  };

  const currentSort = `${filters.sort_by || "published_at"}-${
    filters.sort_order || "desc"
  }`;

  const activeFiltersCount = [
    filters.category_id,
    filters.tag_id,
    filters.author_id,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari artikel..."
          value={filters.q || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Sort */}
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="published_at-desc">Terbaru</SelectItem>
          <SelectItem value="published_at-asc">Terlama</SelectItem>
          <SelectItem value="title-asc">Judul A-Z</SelectItem>
          <SelectItem value="title-desc">Judul Z-A</SelectItem>
          <SelectItem value="views-desc">Paling Populer</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Artikel</SheetTitle>
            <SheetDescription>
              Pilih kategori, tag, atau penulis untuk menyaring artikel
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={localFilters.category_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    category_id: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div className="space-y-2">
              <Label>Tag</Label>
              <Select
                value={localFilters.tag_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    tag_id: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tag</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleResetFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button className="flex-1" onClick={handleApplyFilters}>
                Terapkan
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
