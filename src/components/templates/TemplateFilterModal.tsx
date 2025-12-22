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
import { TEMPLATE_TYPE_OPTIONS } from "@/types/template";

interface TemplateFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    type?: string;
    is_premium?: string;
    is_active?: string;
  };
  onApply: (filters: {
    type?: string;
    is_premium?: string;
    is_active?: string;
  }) => void;
}

export function TemplateFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: TemplateFilterModalProps) {
  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onApply({
      type: formData.get("type") as string || undefined,
      is_premium: formData.get("is_premium") as string || undefined,
      is_active: formData.get("is_active") as string || undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    onApply({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleApply} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Template</Label>
            <Select name="type" defaultValue={filters.type || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Semua tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua tipe</SelectItem>
                {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status Premium</Label>
            <Select name="is_premium" defaultValue={filters.is_premium || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                <SelectItem value="true">Premium</SelectItem>
                <SelectItem value="false">Gratis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status Aktif</Label>
            <Select name="is_active" defaultValue={filters.is_active || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Terapkan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
