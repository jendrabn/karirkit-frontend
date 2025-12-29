import { useState } from "react";
import {
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Building2,
  Briefcase,
  MapPin,
  Clock,
  Laptop,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  type JobRole,
  type City,
  type Company,
  JOB_TYPE_LABELS,
  WORK_SYSTEM_LABELS,
  type JobType,
  type WorkSystem,
} from "@/types/job";

interface JobFilterState {
  job_types?: JobType[];
  work_systems?: WorkSystem[];
  job_role_ids?: string[];
  city_ids?: string[];
  company_ids?: string[];
  experience_min?: number;
}

interface JobFilterSidebarProps {
  jobRoles: JobRole[];
  cities: City[];
  companies: Company[];
  filters: JobFilterState;
  onFilterChange: (filters: JobFilterState) => void;
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
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors group">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
            {title}
          </h4>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-1 pb-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({
  jobRoles,
  cities,
  companies,
  filters,
  onFilterChange,
  onClearFilters,
}: JobFilterSidebarProps) {
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  // Helper to count selected items in a category for badges (optional enhancement, not implemented here but good to have)

  const hasActiveFilters =
    (filters.job_types?.length || 0) > 0 ||
    (filters.work_systems?.length || 0) > 0 ||
    (filters.job_role_ids?.length || 0) > 0 ||
    (filters.city_ids?.length || 0) > 0 ||
    (filters.company_ids?.length || 0) > 0 ||
    filters.experience_min !== undefined;

  const handleJobTypeChange = (value: JobType, checked: boolean) => {
    const current = filters.job_types || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({
      ...filters,
      job_types: updated.length > 0 ? updated : undefined,
    });
  };

  const handleWorkSystemChange = (value: WorkSystem, checked: boolean) => {
    const current = filters.work_systems || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({
      ...filters,
      work_systems: updated.length > 0 ? updated : undefined,
    });
  };

  const handleJobRoleChange = (value: string, checked: boolean) => {
    const current = filters.job_role_ids || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({
      ...filters,
      job_role_ids: updated.length > 0 ? updated : undefined,
    });
  };

  const handleCompanyChange = (value: string, checked: boolean) => {
    const current = filters.company_ids || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({
      ...filters,
      company_ids: updated.length > 0 ? updated : undefined,
    });
  };

  const handleCityChange = (value: string, checked: boolean) => {
    const current = filters.city_ids || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({
      ...filters,
      city_ids: updated.length > 0 ? updated : undefined,
    });
  };

  const handleExperienceChange = (value: number, checked: boolean) => {
    onFilterChange({
      ...filters,
      experience_min: checked ? value : undefined,
    });
  };

  const displayedRoles = showAllRoles ? jobRoles : jobRoles.slice(0, 5);
  const displayedCities = showAllCities ? cities : cities.slice(0, 5);
  const displayedCompanies = showAllCompanies
    ? companies
    : companies.slice(0, 5);

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="bg-destructive/5 rounded-lg p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
          >
            <X className="h-3.5 w-3.5 mr-2" />
            Hapus Semua Filter
          </Button>
        </div>
      )}

      {/* Company Filter */}
      <FilterSection title="Perusahaan" icon={Building2}>
        <div className="space-y-3">
          {displayedCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center space-x-3 group/item"
            >
              <Checkbox
                id={`company-${company.id}`}
                checked={filters.company_ids?.includes(company.id) || false}
                onCheckedChange={(checked) =>
                  handleCompanyChange(company.id, checked as boolean)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`company-${company.id}`}
                className="text-sm cursor-pointer font-normal group-hover/item:text-primary transition-colors flex-1"
              >
                {company.name}
              </Label>
            </div>
          ))}
          {companies.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllCompanies(!showAllCompanies)}
              className="text-xs font-medium text-primary hover:text-primary/80 hover:underline flex items-center mt-2"
            >
              {showAllCompanies
                ? "Sembunyikan"
                : `Lihat ${companies.length - 5} lainnya`}
            </button>
          )}
        </div>
      </FilterSection>

      <Separator className="bg-border/60" />

      {/* Job Role Filter */}
      <FilterSection title="Role Pekerjaan" icon={Briefcase}>
        <div className="space-y-3">
          {displayedRoles.map((role) => (
            <div
              key={role.id}
              className="flex items-center space-x-3 group/item"
            >
              <Checkbox
                id={`role-${role.id}`}
                checked={filters.job_role_ids?.includes(role.id) || false}
                onCheckedChange={(checked) =>
                  handleJobRoleChange(role.id, checked as boolean)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`role-${role.id}`}
                className="text-sm cursor-pointer font-normal group-hover/item:text-primary transition-colors flex-1"
              >
                {role.name}
              </Label>
            </div>
          ))}
          {jobRoles.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllRoles(!showAllRoles)}
              className="text-xs font-medium text-primary hover:text-primary/80 hover:underline flex items-center mt-2"
            >
              {showAllRoles
                ? "Sembunyikan"
                : `Lihat ${jobRoles.length - 5} lainnya`}
            </button>
          )}
        </div>
      </FilterSection>

      <Separator className="bg-border/60" />

      {/* Job Type Filter */}
      <FilterSection title="Tipe Pekerjaan" icon={Clock}>
        <div className="space-y-3">
          {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-3 group/item">
              <Checkbox
                id={`job-type-${value}`}
                checked={filters.job_types?.includes(value as JobType) || false}
                onCheckedChange={(checked) =>
                  handleJobTypeChange(value as JobType, checked as boolean)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`job-type-${value}`}
                className="text-sm cursor-pointer font-normal group-hover/item:text-primary transition-colors flex-1"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/60" />

      {/* Work System Filter */}
      <FilterSection title="Sistem Kerja" icon={Laptop}>
        <div className="space-y-3">
          {Object.entries(WORK_SYSTEM_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-3 group/item">
              <Checkbox
                id={`work-system-${value}`}
                checked={
                  filters.work_systems?.includes(value as WorkSystem) || false
                }
                onCheckedChange={(checked) =>
                  handleWorkSystemChange(
                    value as WorkSystem,
                    checked as boolean
                  )
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`work-system-${value}`}
                className="text-sm cursor-pointer font-normal group-hover/item:text-primary transition-colors flex-1"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/60" />

      {/* Experience Filter */}
      <FilterSection title="Pengalaman Minimal" icon={GraduationCap}>
        <div className="space-y-3">
          {experienceOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 group/item"
            >
              <Checkbox
                id={`exp-${option.value}`}
                checked={filters.experience_min === option.value}
                onCheckedChange={(checked) =>
                  handleExperienceChange(option.value, checked as boolean)
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`exp-${option.value}`}
                className="text-sm cursor-pointer font-normal group-hover/item:text-primary transition-colors flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/60" />

      {/* City Filter */}
      <FilterSection title="Kota" icon={MapPin}>
        <div className="space-y-3">
          {displayedCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between group/item"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`city-${city.id}`}
                  checked={filters.city_ids?.includes(city.id) || false}
                  onCheckedChange={(checked) =>
                    handleCityChange(city.id, checked as boolean)
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`city-${city.id}`}
                  className="text-sm cursor-pointer font-normal group-hover/item:text-primary transition-colors"
                >
                  {city.name}
                </Label>
              </div>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 h-5 min-w-[1.5rem] justify-center text-muted-foreground bg-muted group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors"
              >
                {city.job_count}
              </Badge>
            </div>
          ))}
          {cities.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllCities(!showAllCities)}
              className="text-xs font-medium text-primary hover:text-primary/80 hover:underline flex items-center mt-2"
            >
              {showAllCities
                ? "Sembunyikan"
                : `Lihat ${cities.length - 5} lainnya`}
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
    (props.filters.company_ids?.length || 0) +
    (props.filters.experience_min !== undefined ? 1 : 0);

  return (
    <>
      {/* Desktop Sidebar */}
      <Card className="hidden lg:block sticky top-24 border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filter Lowongan
            {filterCount > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                {filterCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ScrollArea className="h-[calc(100vh-200px)] pr-4 -mr-4">
            <div className="pr-4 pb-4">
              <FilterContent {...props} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-background/60 backdrop-blur-sm border-dashed"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
              {filterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 min-w-[1.25rem] justify-center bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  {filterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:w-96 flex flex-col p-6"
          >
            <SheetHeader className="text-left space-y-1 p-0">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Filter Lowongan
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                Sesuaikan pencarian karir impianmu
              </p>
            </SheetHeader>
            <div className="flex-1 overflow-hidden -mx-6 px-6 mt-6">
              <ScrollArea className="h-full pr-4">
                <FilterContent {...props} />
              </ScrollArea>
            </div>
            <div className="pt-4 mt-auto border-t">
              <Button
                className="w-full"
                onClick={() => document.getElementById("close-sheet")?.click()}
              >
                Terapkan Filter ({filterCount})
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export type { JobFilterState };
