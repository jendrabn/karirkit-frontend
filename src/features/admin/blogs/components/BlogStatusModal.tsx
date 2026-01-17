import type { Blog, BlogStatus } from "@/types/blog";
import { BLOG_STATUS_OPTIONS } from "@/types/blog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BlogStatusModalProps = {
  open: boolean;
  blog: Blog | null;
  status: BlogStatus;
  onStatusChange: (status: BlogStatus) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
};

export const BlogStatusModal = ({
  open,
  blog,
  status,
  onStatusChange,
  onClose,
  onSave,
  isSaving,
}: BlogStatusModalProps) => (
  <Dialog
    open={open}
    onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        onClose();
      }
    }}
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Ubah Status Blog</DialogTitle>
        <DialogDescription>
          Pilih status baru untuk{" "}
          <span className="font-medium">{blog?.title || "blog ini"}</span>.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <div className="text-sm font-medium">Status</div>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as BlogStatus)}
          disabled={isSaving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            {BLOG_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          Batal
        </Button>
        <Button
          onClick={onSave}
          disabled={!blog || blog.status === status || isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
