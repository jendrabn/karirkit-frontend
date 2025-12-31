import { useNavigate } from "react-router";
import { dayjs } from "@/lib/date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { DashboardStatistics } from "../api/get-dashboard-stats";

interface RecentBlogsTableProps {
  blogs: DashboardStatistics["recent_blogs"];
}

export const RecentBlogsTable = ({ blogs }: RecentBlogsTableProps) => {
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border/60 flex items-center justify-between">
        <h3 className="font-semibold">Blog Terbaru</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/blogs")}
        >
          Lihat Semua
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Diperbarui</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  Belum ada blog
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <span
                      className="font-medium text-sm line-clamp-1"
                      title={blog.title}
                    >
                      {blog.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {blog.user.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(blog.status)}>
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dayjs(blog.created_at).format("DD MMM YYYY, HH:mm")}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dayjs(blog.updated_at).format("DD MMM YYYY, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
