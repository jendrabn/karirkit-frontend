import { useState } from "react";
import { dayjs } from "@/lib/date";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types/user";
import { USER_ROLE_OPTIONS } from "@/types/user";
import { cn } from "@/lib/utils";

export interface FilterValues {
  role?: UserRole;
  created_from?: Date;
  created_to?: Date;
}

interface UserFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
}

export function UserFilterModal({
  open,
  onOpenChange,
  filters,
  onApply,
}: UserFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Filter Users</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={localFilters.role || "all"}
              onValueChange={(val) =>
                setLocalFilters({
                  ...localFilters,
                  role: val === "all" ? undefined : (val as UserRole),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">Semua</SelectItem>
                {USER_ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tanggal Dibuat Dari</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !localFilters.created_from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {localFilters.created_from
                      ? dayjs(localFilters.created_from).format("DD MMM YYYY")
                      : "Pilih tanggal"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-popover z-50"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={localFilters.created_from}
                  onSelect={(date) =>
                    setLocalFilters({ ...localFilters, created_from: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Tanggal Dibuat Sampai</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal px-3",
                    !localFilters.created_to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {localFilters.created_to
                      ? dayjs(localFilters.created_to).format("DD MMM YYYY")
                      : "Pilih tanggal"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-popover z-50"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={localFilters.created_to}
                  onSelect={(date) =>
                    setLocalFilters({ ...localFilters, created_to: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </DialogClose>
          <Button onClick={handleApply}>Terapkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
