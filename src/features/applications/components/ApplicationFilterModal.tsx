/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
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
import {
  JOB_TYPE_OPTIONS,
  WORK_SYSTEM_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/types/application";
import { type GetApplicationsParams } from "../api/get-applications";

type FilterParams = Omit<
  GetApplicationsParams,
  "page" | "per_page" | "q" | "sort_by" | "sort_order"
>;

interface ApplicationFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterParams;
  onApplyFilters: (filters: FilterParams) => void;
}

export function ApplicationFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: ApplicationFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.date_from ? dayjs(filters.date_from).toDate() : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.date_to ? dayjs(filters.date_to).toDate() : undefined
  );

  useEffect(() => {
    setLocalFilters(filters);
    setDateFrom(
      filters.date_from ? dayjs(filters.date_from).toDate() : undefined
    );
    setDateTo(filters.date_to ? dayjs(filters.date_to).toDate() : undefined);
  }, [filters, open]);

  const handleApply = () => {
    onApplyFilters({
      ...localFilters,
      date_from: dateFrom ? dayjs(dateFrom).format("YYYY-MM-DD") : undefined,
      date_to: dateTo ? dayjs(dateTo).format("YYYY-MM-DD") : undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Filter Lamaran</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            <FieldSet className="space-y-4">
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
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom
                          ? dayjs(dateFrom).format("DD/MM/YYYY")
                          : "Dari"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
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
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? dayjs(dateTo).format("DD/MM/YYYY") : "Sampai"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Field>

              {/* Job Type */}
              <Field>
                <FieldLabel>Tipe Pekerjaan</FieldLabel>
                <Select
                  value={localFilters.job_type || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      job_type: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe pekerjaan" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {JOB_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Work System */}
              <Field>
                <FieldLabel>Sistem Kerja</FieldLabel>
                <Select
                  value={localFilters.work_system || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      work_system: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sistem kerja" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">Semua Sistem</SelectItem>
                    {WORK_SYSTEM_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Status */}
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={localFilters.status || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      status: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60">
                    <SelectItem value="all">Semua Status</SelectItem>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Result Status */}
              <Field>
                <FieldLabel>Hasil</FieldLabel>
                <Select
                  value={localFilters.result_status || "all"}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      result_status: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hasil" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">Semua Hasil</SelectItem>
                    {RESULT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
