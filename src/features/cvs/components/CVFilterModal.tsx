import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_OPTIONS } from "@/types/cv";

export interface FilterValues {
  name?: string;
  dateFrom?: Date;
  dateTo?: Date;
  language?: "id" | "en";
}

interface CVFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
}

export function CVFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: CVFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Filter CV</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="space-y-4">
              <Field>
                <FieldLabel>Nama</FieldLabel>
                <Input
                  value={localFilters.name || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, name: e.target.value })
                  }
                  placeholder="Cari berdasarkan nama..."
                />
              </Field>

              <Field>
                <FieldLabel>Bahasa</FieldLabel>
                <Select
                  value={localFilters.language || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      language:
                        value === "all" ? undefined : (value as "id" | "en"),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bahasa</SelectItem>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Tanggal Dibuat</FieldLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !localFilters.dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.dateFrom
                          ? format(localFilters.dateFrom, "dd/MM/yyyy")
                          : "Dari"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.dateFrom}
                        onSelect={(date) =>
                          setLocalFilters({ ...localFilters, dateFrom: date })
                        }
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !localFilters.dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.dateTo
                          ? format(localFilters.dateTo, "dd/MM/yyyy")
                          : "Sampai"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.dateTo}
                        onSelect={(date) =>
                          setLocalFilters({ ...localFilters, dateTo: date })
                        }
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Field>
            </FieldSet>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Terapkan Filter</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
