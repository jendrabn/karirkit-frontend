import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { JobRole, City, JOB_TYPE_LABELS, WORK_SYSTEM_LABELS, JobType, WorkSystem } from "@/types/job";

interface JobFilters {
  job_types?: JobType[];
  work_systems?: WorkSystem[];
  job_role_ids?: string[];
  city_ids?: string[];
  experience_min?: number;
}

interface JobFilterSidebarProps {
  jobRoles: JobRole[];
  cities: City[];
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
}

const experienceOptions = [
  { value: 0, label: "Fresh Graduate" },
  { value: 1, label: "1+ tahun" },
  { value: 2, label: "2+ tahun" },
  { value: 3, label: "3+ tahun" },
  { value: 5, label: "5+ tahun" },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
        <h4 className="font-medium text-sm">{title}</h4>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({
  jobRoles,
  cities,
  filters,
  onFilterChange,
  onClearFilters,
}: JobFilterSidebarProps) {
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const hasActiveFilters = 
    (filters.job_types?.length || 0) > 0 ||
    (filters.work_systems?.length || 0) > 0 ||
    (filters.job_role_ids?.length || 0) > 0 ||
    (filters.city_ids?.length || 0) > 0 ||
    filters.experience_min !== undefined;

  const handleJobTypeChange = (value: JobType, checked: boolean) => {
    const current = filters.job_types || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({ ...filters, job_types: updated.length > 0 ? updated : undefined });
  };

  const handleWorkSystemChange = (value: WorkSystem, checked: boolean) => {
    const current = filters.work_systems || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({ ...filters, work_systems: updated.length > 0 ? updated : undefined });
  };

  const handleJobRoleChange = (value: string, checked: boolean) => {
    const current = filters.job_role_ids || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({ ...filters, job_role_ids: updated.length > 0 ? updated : undefined });
  };

  const handleCityChange = (value: string, checked: boolean) => {
    const current = filters.city_ids || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({ ...filters, city_ids: updated.length > 0 ? updated : undefined });
  };

  const handleExperienceChange = (value: number, checked: boolean) => {
    onFilterChange({
      ...filters,
      experience_min: checked ? value : undefined,
    });
  };

  const displayedRoles = showAllRoles ? jobRoles : jobRoles.slice(0, 5);
  const displayedCities = showAllCities ? cities : cities.slice(0, 5);

  return (
    <div className="space-y-1">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-full justify-start text-destructive hover:text-destructive mb-4"
        >
          <X className="h-4 w-4 mr-2" />
          Hapus Semua Filter
        </Button>
      )}

      {/* Job Role Filter */}
      <FilterSection title="Role pekerjaan">
        <div className="space-y-3">
          {displayedRoles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={filters.job_role_ids?.includes(role.id) || false}
                onCheckedChange={(checked) =>
                  handleJobRoleChange(role.id, checked as boolean)
                }
              />
              <Label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer font-normal">
                {role.name}
              </Label>
            </div>
          ))}
          {jobRoles.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllRoles(!showAllRoles)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {showAllRoles ? "Tampilkan lebih sedikit" : "Selengkapnya"}
            </button>
          )}
        </div>
      </FilterSection>

      <Separator />

      {/* Job Type Filter */}
      <FilterSection title="Tipe pekerjaan">
        <div className="space-y-3">
          {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`job-type-${value}`}
                checked={filters.job_types?.includes(value as JobType) || false}
                onCheckedChange={(checked) =>
                  handleJobTypeChange(value as JobType, checked as boolean)
                }
              />
              <Label htmlFor={`job-type-${value}`} className="text-sm cursor-pointer font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Work System Filter */}
      <FilterSection title="Sistem kerja">
        <div className="space-y-3">
          {Object.entries(WORK_SYSTEM_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`work-system-${value}`}
                checked={filters.work_systems?.includes(value as WorkSystem) || false}
                onCheckedChange={(checked) =>
                  handleWorkSystemChange(value as WorkSystem, checked as boolean)
                }
              />
              <Label htmlFor={`work-system-${value}`} className="text-sm cursor-pointer font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Experience Filter */}
      <FilterSection title="Pengalaman minimal">
        <div className="space-y-3">
          {experienceOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`exp-${option.value}`}
                checked={filters.experience_min === option.value}
                onCheckedChange={(checked) =>
                  handleExperienceChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`exp-${option.value}`} className="text-sm cursor-pointer font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* City Filter */}
      <FilterSection title="Kota">
        <div className="space-y-3">
          {displayedCities.map((city) => (
            <div key={city.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`city-${city.id}`}
                  checked={filters.city_ids?.includes(city.id) || false}
                  onCheckedChange={(checked) =>
                    handleCityChange(city.id, checked as boolean)
                  }
                />
                <Label htmlFor={`city-${city.id}`} className="text-sm cursor-pointer font-normal">
                  {city.name}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">({city.job_count})</span>
            </div>
          ))}
          {cities.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllCities(!showAllCities)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {showAllCities ? "Tampilkan lebih sedikit" : "Selengkapnya"}
            </button>
          )}
        </div>
      </FilterSection>
    </div>
  );
}

export function JobFilterSidebar(props: JobFilterSidebarProps) {
  const filterCount = 
    (props.filters.job_types?.length || 0) +
    (props.filters.work_systems?.length || 0) +
    (props.filters.job_role_ids?.length || 0) +
    (props.filters.city_ids?.length || 0) +
    (props.filters.experience_min !== undefined ? 1 : 0);

  return (
    <>
      {/* Desktop Sidebar */}
      <Card className="hidden lg:block sticky top-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <FilterContent {...props} />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
              {filterCount > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {filterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filter Lowongan
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
              <FilterContent {...props} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export type { JobFilters };
