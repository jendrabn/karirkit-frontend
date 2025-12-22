import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEMPLATE_TYPE_OPTIONS, type TemplateType } from "@/types/template";
import type { GetTemplatesParams } from "../api/get-templates";

interface TemplatesFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Omit<GetTemplatesParams, "page" | "per_page" | "q" | "sort_by" | "sort_order">;
  onApply: (filters: Omit<GetTemplatesParams, "page" | "per_page" | "q" | "sort_by" | "sort_order">) => void;
}

export function TemplatesFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: TemplatesFilterModalProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, open]);

  const handleApply = () => {
    onApply(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onApply({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Template</Label>
            <Select 
                value={localFilters.type || "all"} 
                onValueChange={(val) => setLocalFilters({...localFilters, type: val === "all" ? undefined : val as TemplateType})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua tipe</SelectItem>
                {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bahasa</Label>
            <Select 
                value={localFilters.language || "all"}
                onValueChange={(val) => setLocalFilters({...localFilters, language: val === "all" ? undefined : val as "en" | "id"})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua bahasa</SelectItem>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="en">Inggris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status Premium</Label>
            <Select 
                value={localFilters.is_premium === undefined ? "all" : localFilters.is_premium ? "true" : "false"}
                onValueChange={(val) => setLocalFilters({...localFilters, is_premium: val === "all" ? undefined : val === "true"})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="true">Premium</SelectItem>
                <SelectItem value="false">Gratis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Terapkan</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
