import { useState } from "react";
import { dayjs } from "@/lib/date";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type Language, LANGUAGE_OPTIONS } from "@/types/applicationLetter";

export interface FilterValues {
  dateFrom?: Date;
  dateTo?: Date;
  language?: Language;
  company_name?: string;
  company_city?: string;
  applicant_city?: string;
  gender?: "male" | "female";
  marital_status?: "single" | "married" | "widowed";
}

interface ApplicationLetterFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
}

export function ApplicationLetterFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: ApplicationLetterFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setLocalFilters(filters);
    }
    onOpenChange(nextOpen);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!max-w-3xl p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Filter Surat Lamaran</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range */}
              <Field>
                <FieldLabel>Tanggal Lamaran</FieldLabel>
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
                          ? dayjs(localFilters.dateFrom).format("DD/MM/YYYY")
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
                          ? dayjs(localFilters.dateTo).format("DD/MM/YYYY")
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

              {/* Language */}
              <Field>
                <FieldLabel>Bahasa</FieldLabel>
                <Select
                  value={localFilters.language || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      language:
                        value === "all" ? undefined : (value as Language),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bahasa" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Company Name */}
              <Field>
                <FieldLabel>Nama Perusahaan</FieldLabel>
                <Input
                  placeholder="Cari nama perusahaan..."
                  value={localFilters.company_name || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      company_name: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Kota Perusahaan</FieldLabel>
                <Input
                  placeholder="Contoh: Jakarta, Bandung"
                  value={localFilters.company_city || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      company_city: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Kota Pelamar</FieldLabel>
                <Input
                  placeholder="Contoh: Surabaya, Medan"
                  value={localFilters.applicant_city || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      applicant_city: e.target.value,
                    })
                  }
                />
              </Field>


              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select
                  value={localFilters.gender || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      gender:
                        value === "all"
                          ? undefined
                          : (value as FilterValues["gender"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Gender" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Status Pernikahan</FieldLabel>
                <Select
                  value={localFilters.marital_status || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      marital_status:
                        value === "all"
                          ? undefined
                          : (value as FilterValues["marital_status"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

            </FieldSet>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Terapkan</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
