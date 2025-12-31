import { useState } from "react";
import {
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  Briefcase,
  Clock,
  MapPin,
  TrendingUp,
  Banknote,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  type JobType,
  type WorkSystem,
  EDUCATION_LEVEL_LABELS,
  type EducationLevel,
} from "@/types/job";

interface JobFilterState {
  job_types?: JobType[];
  work_systems?: WorkSystem[];
  job_role_ids?: string[];
  city_ids?: string[];
  company_ids?: string[];
  experience_min?: number;
  salary_min?: number;
  education_level?: EducationLevel[];
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
  { value: 0, label: "Kurang dari 1 tahun" },
  { value: 1, label: "1-3 tahun" },
  { value: 4, label: "4-5 tahun" },
  { value: 6, label: "6-10 tahun" },
  { value: 10, label: "Lebih dari 10 tahun" },
];

const salaryOptions = [
  { value: 3000000, label: "Min. Rp 3.000.000" },
  { value: 5000000, label: "Min. Rp 5.000.000" },
  { value: 8000000, label: "Min. Rp 8.000.000" },
  { value: 10000000, label: "Min. Rp 10.000.000" },
  { value: 20000000, label: "Min. Rp 20.000.000" },
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full group py-1 px-0">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-foreground" />}
          <h4 className="font-bold text-base text-foreground">{title}</h4>
        </div>
        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ShowMoreToggle({
  isShowingMore,
  onToggle,
}: {
  isShowingMore: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex justify-center w-full">
      <button
        type="button"
        onClick={onToggle}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors mt-2"
      >
        {isShowingMore ? "Lihat lebih sedikit" : "Lihat lebih banyak"}
      </button>
    </div>
  );
}

function FilterContent({
  jobRoles,
  cities,
  companies, // Keeping for completeness, though not explicitly in "the image" request, usually standard
  filters,
  onFilterChange,
  onClearFilters,
}: JobFilterSidebarProps) {
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllJobTypes, setShowAllJobTypes] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const hasActiveFilters =
    (filters.job_types?.length || 0) > 0 ||
    (filters.work_systems?.length || 0) > 0 ||
    (filters.job_role_ids?.length || 0) > 0 ||
    (filters.city_ids?.length || 0) > 0 ||
    (filters.company_ids?.length || 0) > 0 ||
    (filters.education_level?.length || 0) > 0 ||
    filters.salary_min !== undefined ||
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

  const handleSalaryChange = (value: number, checked: boolean) => {
    onFilterChange({
      ...filters,
      salary_min: checked ? value : undefined,
    });
  };

  const handleEducationChange = (value: EducationLevel, checked: boolean) => {
    const current = filters.education_level || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange({
      ...filters,
      education_level: updated.length > 0 ? updated : undefined,
    });
  };

  const handleExperienceChange = (value: number, checked: boolean) => {
    // If checking an already selected one, uncheck it (undefined).
    // Or if different logic needed (single select vs multi select).
    // Usually experience ranges are single select intervals or min.
    // The previous code was `filters.experience_min === value`.
    // Let's stick to single select behavior for simplicity unless multi.
    onFilterChange({
      ...filters,
      experience_min: checked ? value : undefined,
    });
  };

  // Filter cities by search
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Filter companies by search
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const displayedRoles = showAllRoles ? jobRoles : jobRoles.slice(0, 5);
  const displayedCities = showAllCities
    ? filteredCities
    : filteredCities.slice(0, 5);
  const displayedCompanies = showAllCompanies
    ? filteredCompanies
    : filteredCompanies.slice(0, 5);

  // Job Types
  const jobTypes = Object.entries(JOB_TYPE_LABELS);
  const displayedJobTypes = showAllJobTypes ? jobTypes : jobTypes.slice(0, 5);

  // Education Levels
  const educationLevels = Object.entries(EDUCATION_LEVEL_LABELS);
  const displayedEducation = showAllEducation
    ? educationLevels
    : educationLevels.slice(0, 5);

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="bg-destructive/5 rounded-lg p-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10 h-8 font-medium"
          >
            <X className="h-4 w-4 mr-2" />
            Hapus Semua Filter
          </Button>
        </div>
      )}

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
                className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <Label
                htmlFor={`role-${role.id}`}
                className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
              >
                {role.name}
              </Label>
            </div>
          ))}
          {jobRoles.length > 5 && (
            <ShowMoreToggle
              isShowingMore={showAllRoles}
              onToggle={() => setShowAllRoles(!showAllRoles)}
            />
          )}
        </div>
      </FilterSection>

      <Separator className="bg-border/40" />

      {/* Job Type Filter */}
      <FilterSection title="Tipe Pekerjaan" icon={Clock}>
        <div className="space-y-3">
          {displayedJobTypes.map(([value, label]) => (
            <div key={value} className="flex items-center space-x-3 group/item">
              <Checkbox
                id={`job-type-${value}`}
                checked={filters.job_types?.includes(value as JobType) || false}
                onCheckedChange={(checked) =>
                  handleJobTypeChange(value as JobType, checked as boolean)
                }
                className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <Label
                htmlFor={`job-type-${value}`}
                className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
              >
                {label}
              </Label>
            </div>
          ))}
          {jobTypes.length > 5 && (
            <ShowMoreToggle
              isShowingMore={showAllJobTypes}
              onToggle={() => setShowAllJobTypes(!showAllJobTypes)}
            />
          )}
        </div>
      </FilterSection>

      <Separator className="bg-border/40" />

      {/* City Filter */}
      <FilterSection title="Kota" icon={MapPin}>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tulis kota"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="pl-9 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-3">
            {displayedCities.map((city) => (
              <div
                key={city.id}
                className="flex items-center space-x-3 group/item"
              >
                <Checkbox
                  id={`city-${city.id}`}
                  checked={filters.city_ids?.includes(city.id) || false}
                  onCheckedChange={(checked) =>
                    handleCityChange(city.id, checked as boolean)
                  }
                  className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                />
                <Label
                  htmlFor={`city-${city.id}`}
                  className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
                >
                  {city.name}
                </Label>
              </div>
            ))}
            {filteredCities.length > 5 && (
              <ShowMoreToggle
                isShowingMore={showAllCities}
                onToggle={() => setShowAllCities(!showAllCities)}
              />
            )}
          </div>
        </div>
      </FilterSection>

      <Separator className="bg-border/40" />

      {/* Experience Filter */}
      <FilterSection title="Pengalaman Bekerja" icon={TrendingUp}>
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
                className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <Label
                htmlFor={`exp-${option.value}`}
                className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/40" />

      {/* Salary Filter (Treated as Single Select for simplicity like Experience) */}
      <FilterSection title="Gaji Minimum" icon={Banknote}>
        <div className="space-y-3">
          {salaryOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 group/item"
            >
              <Checkbox
                id={`salary-${option.value}`}
                checked={filters.salary_min === option.value}
                onCheckedChange={(checked) =>
                  handleSalaryChange(option.value, checked as boolean)
                }
                className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <Label
                htmlFor={`salary-${option.value}`}
                className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/40" />

      {/* Education Filter */}
      <FilterSection title="Level Pendidikan" icon={GraduationCap}>
        <div className="space-y-3">
          {displayedEducation.map(([value, label]) => (
            <div key={value} className="flex items-center space-x-3 group/item">
              <Checkbox
                id={`edu-${value}`}
                checked={
                  filters.education_level?.includes(value as EducationLevel) ||
                  false
                }
                onCheckedChange={(checked) =>
                  handleEducationChange(
                    value as EducationLevel,
                    checked as boolean
                  )
                }
                className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <Label
                htmlFor={`edu-${value}`}
                className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
              >
                {label}
              </Label>
            </div>
          ))}
          {educationLevels.length > 5 && (
            <ShowMoreToggle
              isShowingMore={showAllEducation}
              onToggle={() => setShowAllEducation(!showAllEducation)}
            />
          )}
        </div>
      </FilterSection>

      <Separator className="bg-border/40" />

      {/* Company Filter */}
      <FilterSection title="Perusahaan" icon={Building2}>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari perusahaan"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="pl-9 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary transition-colors"
            />
          </div>
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
                  className="rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                />
                <Label
                  htmlFor={`company-${company.id}`}
                  className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors flex-1"
                >
                  {company.name}
                </Label>
              </div>
            ))}
            {filteredCompanies.length > 5 && (
              <ShowMoreToggle
                isShowingMore={showAllCompanies}
                onToggle={() => setShowAllCompanies(!showAllCompanies)}
              />
            )}
          </div>
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
    (props.filters.education_level?.length || 0) +
    (props.filters.salary_min !== undefined ? 1 : 0) +
    (props.filters.experience_min !== undefined ? 1 : 0);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <Card className="hidden lg:block sticky top-24 border border-border/60 shadow-none bg-card">
        <CardContent className="pt-6">
          <FilterContent {...props} />
        </CardContent>
      </Card>

      {/* Mobile Modal */}
      <div className="lg:hidden">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
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
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-6 overflow-hidden">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Filter Lowongan
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 py-4">
              <FilterContent {...props} />
            </div>
            <div className="pt-4 border-t mt-auto">
              <Button className="w-full" onClick={() => setIsOpen(false)}>
                Terapkan Filter ({filterCount})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export type { JobFilterState };
