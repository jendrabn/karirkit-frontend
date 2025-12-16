import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  JobType,
  WorkSystem,
  ApplicationStatus,
  ResultStatus,
} from "@/types/application";

export interface FilterValues {
  dateFrom?: Date;
  dateTo?: Date;
  job_type?: JobType;
  work_system?: WorkSystem;
  status?: ApplicationStatus;
  result_status?: ResultStatus;
}

interface ApplicationFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
}

export function ApplicationFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: ApplicationFilterModalProps) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Lamaran</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Tanggal Lamaran</Label>
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
                    {localFilters.dateFrom ? format(localFilters.dateFrom, "dd/MM/yyyy") : "Dari"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateFrom}
                    onSelect={(date) => setLocalFilters({ ...localFilters, dateFrom: date })}
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
                    {localFilters.dateTo ? format(localFilters.dateTo, "dd/MM/yyyy") : "Sampai"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateTo}
                    onSelect={(date) => setLocalFilters({ ...localFilters, dateTo: date })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label>Tipe Pekerjaan</Label>
            <Select
              value={localFilters.job_type || ""}
              onValueChange={(value) => setLocalFilters({ ...localFilters, job_type: value as JobType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe pekerjaan" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {JOB_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Work System */}
          <div className="space-y-2">
            <Label>Sistem Kerja</Label>
            <Select
              value={localFilters.work_system || ""}
              onValueChange={(value) => setLocalFilters({ ...localFilters, work_system: value as WorkSystem })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih sistem kerja" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {WORK_SYSTEM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={localFilters.status || ""}
              onValueChange={(value) => setLocalFilters({ ...localFilters, status: value as ApplicationStatus })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-60">
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result Status */}
          <div className="space-y-2">
            <Label>Hasil</Label>
            <Select
              value={localFilters.result_status || ""}
              onValueChange={(value) => setLocalFilters({ ...localFilters, result_status: value as ResultStatus })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih hasil" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {RESULT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Terapkan Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
