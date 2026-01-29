import { useState } from "react";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { dayjs } from "@/lib/date";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  User,
  MoreVertical,
  Loader2,
  Globe,
  Lock,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { CVVisibilityModal } from "./CVVisibilityModal";
import { CVFilterModal } from "@/features/cvs/components/CVFilterModal";
import { CVColumnToggle } from "@/features/cvs/components/CVColumnToggle";
import { defaultColumnVisibility } from "@/features/cvs/types/cv-column-toggle.constants";
import type { ColumnVisibility } from "@/features/cvs/components/CVColumnToggle";
import { useCVs } from "@/features/cvs/api/get-cvs";
import { useDeleteCV } from "@/features/cvs/api/delete-cv";
import { useDuplicateCV } from "@/features/cvs/api/duplicate-cv";
import { useDownloadCV } from "@/features/cvs/api/download-cv";
import { useMassDeleteCVs } from "@/features/cvs/api/mass-delete-cvs";
import type { CV } from "@/features/cvs/api/get-cvs";
import { DEGREE_OPTIONS } from "@/types/cv";
import { buildImageUrl, cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useUrlParams } from "@/hooks/use-url-params";
import { SortableHeader } from "@/components/SortableHeader";

type SortField = "updated_at" | "name" | "created_at" | "views" | "headline";
type SortOrder = "asc" | "desc";

const CVList = () => {
  const navigate = useNavigate();

  // Use URL params hook
  const {
    params,
    setParam,
    setParams,
    searchInput,
    handleSearchInput,
    handleSearchSubmit,
  } = useUrlParams({
    page: 1,
    per_page: 10,
    q: "",
    sort_by: "updated_at" as SortField,
    sort_order: "desc" as SortOrder,
    language: "",
    visibility: "",
    views_from: "",
    views_to: "",
    educations_degree: "",
    experiences_job_type: "",
    experiences_is_current: "",
    skills_level: "",
    skills_skill_category: "",
    organizations_organization_type: "",
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "cv-table-columns",
      defaultColumnVisibility,
    );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [cvToEditVisibility, setCvToEditVisibility] = useState<CV | null>(null);

  // API calls
  const { data: cvsResponse, isLoading } = useCVs({
    params: {
      page: params.page,
      per_page: params.per_page,
      q: params.q || undefined,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      language: (params.language as "id" | "en") || undefined,
      visibility: (params.visibility as "private" | "public") || undefined,
      views_from: params.views_from ? Number(params.views_from) : undefined,
      views_to: params.views_to ? Number(params.views_to) : undefined,
      educations_degree: params.educations_degree || undefined,
      experiences_job_type: params.experiences_job_type || undefined,
      experiences_is_current:
        (params.experiences_is_current as "true" | "false") || undefined,
      skills_level: params.skills_level || undefined,
      skills_skill_category: params.skills_skill_category || undefined,
      organizations_organization_type:
        params.organizations_organization_type || undefined,
    },
  });

  const deleteMutation = useDeleteCV({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV berhasil dihapus");
        setDeleteDialogOpen(false);
        setCvToDelete(null);
      },
    },
  });

  const duplicateMutation = useDuplicateCV({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success("CV berhasil diduplikasi");
        navigate(paths.cvs.detail.getHref(data.id));
      },
    },
  });

  const downloadMutation = useDownloadCV();

  const massDeleteMutation = useMassDeleteCVs({
    mutationConfig: {
      onSuccess: () => {
        toast.success("CV terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteDialogOpen(false);
      },
    },
  });

  const cvs = cvsResponse?.items || [];
  const pagination = cvsResponse?.pagination;
  const totalPages = pagination?.total_pages || 1;

  const handleSort = (field: SortField) => {
    if (params.sort_by === field) {
      setParam(
        "sort_order",
        params.sort_order === "asc" ? "desc" : "asc",
        false,
      );
    } else {
      setParams({ sort_by: field, sort_order: "asc" }, false);
    }
  };

  const handleDelete = (id: string) => {
    setCvToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cvToDelete) {
      deleteMutation.mutate(cvToDelete);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === cvs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cvs.map((cv) => cv.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const confirmBulkDelete = () => {
    massDeleteMutation.mutate({ ids: selectedIds });
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  const handleDownload = (cv: CV, format: "docx" | "pdf") => {
    downloadMutation.mutate({
      id: cv.id,
      format,
      name: cv.name,
      headline: cv.headline,
    });
  };

  const getCvPublicUrl = (slug?: string | null) => {
    if (!slug) return null;
    return `${window.location.origin}/cv/${slug}`;
  };

  const handleShare = async (cv: CV) => {
    const url = getCvPublicUrl(cv.slug);
    if (!url) {
      toast.error("Slug CV belum tersedia");
      return;
    }

    if (!navigator.share) {
      toast.error("Fitur share tidak didukung di browser ini");
      return;
    }

    try {
      await navigator.share({
        title: cv.name,
        text: cv.headline || undefined,
        url,
      });
    } catch (error) {
      console.log(error);
      toast.error("Gagal membagikan CV");
    }
  };

  // Helper to get latest experience
  const getLatestExperience = (cv: CV) => {
    if (!cv.experiences || cv.experiences.length === 0) return null;
    return cv.experiences[0];
  };

  // Helper to get latest education
  const getLatestEducation = (cv: CV) => {
    if (!cv.educations || cv.educations.length === 0) return null;
    return cv.educations[0];
  };

  return (
    <>
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, headline, email, telepon, alamat..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({selectedIds.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <CVColumnToggle
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
          <Button size="sm" onClick={() => navigate("/cvs/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Buat CV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        cvs.length > 0 && selectedIds.length === cvs.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columnVisibility.headline && (
                    <TableHead>
                      <SortableHeader field="headline" onSort={handleSort}>
                        Headline / Posisi
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.latest_experience && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Pengalaman Terakhir
                    </TableHead>
                  )}
                  {columnVisibility.latest_education && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Pendidikan Terakhir
                    </TableHead>
                  )}
                  {columnVisibility.skills_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Jumlah Skill
                    </TableHead>
                  )}
                  {columnVisibility.language && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Bahasa
                    </TableHead>
                  )}
                  {columnVisibility.visibility && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Visibility
                    </TableHead>
                  )}
                  {columnVisibility.views && (
                    <TableHead>
                      <SortableHeader field="views" onSort={handleSort}>
                        Views
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.name && (
                    <TableHead>
                      <SortableHeader field="name" onSort={handleSort}>
                        Nama
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.email && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Email
                    </TableHead>
                  )}
                  {columnVisibility.phone && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      No. Telepon
                    </TableHead>
                  )}
                  {columnVisibility.about && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Ringkasan
                    </TableHead>
                  )}
                  {columnVisibility.address && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Alamat
                    </TableHead>
                  )}
                  {columnVisibility.photo && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Foto
                    </TableHead>
                  )}
                  {columnVisibility.certificates_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Jumlah Sertifikat
                    </TableHead>
                  )}
                  {columnVisibility.awards_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Jumlah Penghargaan
                    </TableHead>
                  )}
                  {columnVisibility.organizations_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Organisasi
                    </TableHead>
                  )}
                  {columnVisibility.social_links_count && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Sosial
                    </TableHead>
                  )}
                  {columnVisibility.template && (
                    <TableHead className="uppercase text-xs font-medium tracking-wide">
                      Template
                    </TableHead>
                  )}
                  {columnVisibility.created_at && (
                    <TableHead>
                      <SortableHeader field="created_at" onSort={handleSort}>
                        Dibuat
                      </SortableHeader>
                    </TableHead>
                  )}
                  {columnVisibility.updated_at && (
                    <TableHead>
                      <SortableHeader field="updated_at" onSort={handleSort}>
                        Diperbarui
                      </SortableHeader>
                    </TableHead>
                  )}
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={20} className="py-14 text-center">
                      <div className="inline-flex items-center gap-3 rounded-xl border bg-muted/30 px-5 py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Memuat data…
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : cvs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={20}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                        <p className="text-base font-medium">Tidak ada CV</p>
                        <p className="text-sm">Mulai buat CV pertama Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cvs.map((cv, index) => {
                    const latestExp = getLatestExperience(cv);
                    const latestEdu = getLatestEducation(cv);

                    return (
                      <TableRow
                        key={cv.id}
                        className={cn(
                          index % 2 === 0 ? "bg-background" : "bg-muted/20",
                          selectedIds.includes(cv.id) && "bg-primary/5",
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(cv.id)}
                            onCheckedChange={() => handleSelectOne(cv.id)}
                          />
                        </TableCell>
                        {columnVisibility.headline && (
                          <TableCell className="font-medium max-w-[200px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate">
                                  {cv.headline}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{cv.headline}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                        {columnVisibility.latest_experience && (
                          <TableCell>
                            {latestExp ? (
                              <div className="text-sm">
                                <p className="font-medium truncate max-w-[150px]">
                                  {latestExp.job_title}
                                </p>
                                <p className="text-muted-foreground text-xs truncate max-w-[150px]">
                                  {latestExp.company_name}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                        )}
                        {columnVisibility.latest_education && (
                          <TableCell>
                            {latestEdu ? (
                              <div className="text-sm">
                                <p className="font-medium truncate max-w-[150px]">
                                  {DEGREE_OPTIONS.find(
                                    (d) => d.value === latestEdu.degree,
                                  )?.label || latestEdu.degree}
                                </p>
                                <p className="text-muted-foreground text-xs truncate max-w-[150px]">
                                  {latestEdu.school_name}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </TableCell>
                        )}
                        {columnVisibility.skills_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.skills?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.language && (
                          <TableCell>
                            <Badge
                              variant={
                                cv.language === "id" ? "default" : "secondary"
                              }
                            >
                              {cv.language === "id" ? "ID" : "EN"}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.visibility && (
                          <TableCell>
                            <Badge
                              variant={
                                cv.visibility === "public"
                                  ? "default"
                                  : "secondary"
                              }
                              className="gap-1"
                            >
                              {cv.visibility === "public" ? (
                                <Globe className="h-3 w-3" />
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}
                              {cv.visibility === "public"
                                ? "Public"
                                : "Private"}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.views && (
                          <TableCell>{cv.views || 0}</TableCell>
                        )}
                        {columnVisibility.name && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                {cv.photo ? (
                                  <AvatarImage
                                    src={buildImageUrl(cv.photo)}
                                    className="object-cover"
                                  />
                                ) : null}
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {cv.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{cv.name}</span>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.email && (
                          <TableCell>{cv.email}</TableCell>
                        )}
                        {columnVisibility.phone && (
                          <TableCell>{cv.phone}</TableCell>
                        )}
                        {columnVisibility.about && (
                          <TableCell className="max-w-[200px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate text-muted-foreground">
                                  {cv.about || "-"}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px]">
                                <p>{cv.about || "-"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                        {columnVisibility.address && (
                          <TableCell className="max-w-[150px] truncate">
                            {cv.address}
                          </TableCell>
                        )}
                        {columnVisibility.photo && (
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={cv.photo}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                        )}
                        {columnVisibility.certificates_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.certificates?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.awards_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.awards?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.organizations_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.organizations?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.social_links_count && (
                          <TableCell>
                            <Badge variant="secondary">
                              {cv.social_links?.length || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.template && (
                          <TableCell>{cv.template?.name || "-"}</TableCell>
                        )}
                        {columnVisibility.created_at && (
                          <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                            {dayjs(cv.created_at).format("DD MMM YYYY, HH:mm")}
                          </TableCell>
                        )}
                        {columnVisibility.updated_at && (
                          <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                            {dayjs(cv.updated_at).format("DD MMM YYYY, HH:mm")}
                          </TableCell>
                        )}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="z-50 bg-popover"
                            >
                              <DropdownMenuItem
                                onClick={() => navigate(`/cvs/${cv.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/cvs/${cv.id}/edit`)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(cv.id)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplikasi
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setCvToEditVisibility(cv);
                                  setVisibilityModalOpen(true);
                                }}
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Atur Visibilitas
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(cv)}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Bagikan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDownload(cv, "docx")}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Docx
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownload(cv, "pdf")}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(cv.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* Pagination */}
        {pagination && pagination.total_items > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan</span>
              <Select
                value={params.per_page.toString()}
                onValueChange={(value) => {
                  setParam("per_page", Number(value), true);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>dari {pagination?.total_items || 0} data</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", 1, false)}
                disabled={params.page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", params.page - 1, false)}
                disabled={params.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm">
                {params.page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", params.page + 1, false)}
                disabled={params.page === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setParam("page", totalPages, false)}
                disabled={params.page === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <CVVisibilityModal
        open={visibilityModalOpen}
        onOpenChange={setVisibilityModalOpen}
        cv={cvToEditVisibility}
      />

      <CVFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={{
          language: (params.language as "id" | "en") || undefined,
          visibility: (params.visibility as "private" | "public") || undefined,
          views_from: params.views_from || "",
          views_to: params.views_to || "",
          educations_degree: params.educations_degree || "",
          experiences_job_type: params.experiences_job_type || "",
          experiences_is_current:
            (params.experiences_is_current as "true" | "false") || undefined,
          skills_level: params.skills_level || "",
          skills_skill_category: params.skills_skill_category || "",
          organizations_organization_type:
            params.organizations_organization_type || "",
        }}
        onApplyFilters={(newFilters) => {
          setParams(
            {
              language: newFilters.language || "",
              visibility: newFilters.visibility || "",
              views_from: newFilters.views_from || "",
              views_to: newFilters.views_to || "",
              educations_degree: newFilters.educations_degree || "",
              experiences_job_type: newFilters.experiences_job_type || "",
              experiences_is_current: newFilters.experiences_is_current || "",
              skills_level: newFilters.skills_level || "",
              skills_skill_category: newFilters.skills_skill_category || "",
              organizations_organization_type:
                newFilters.organizations_organization_type || "",
            },
            true,
          );
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus CV</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CV ini? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} CV</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CV yang dipilih? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={massDeleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                confirmBulkDelete();
              }}
              disabled={massDeleteMutation.isPending}
            >
              {massDeleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingOverlay
        show={downloadMutation.isPending}
        message="Sedang mengunduh CV..."
      />
    </>
  );
};

export default CVList;
