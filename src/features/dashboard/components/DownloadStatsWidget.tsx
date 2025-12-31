import { Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDownloadStats } from "../api/get-download-stats";

export function DownloadStatsWidget() {
  const { data: stats, isLoading, error } = useDownloadStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Est. Download Limit
          </CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex h-[80px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return null; // Don't show if error or no data
  }

  const percentage = Math.min(
    100,
    Math.round((stats.today_count / stats.daily_limit) * 100)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Kuota Unduhan Harian
        </CardTitle>
        <Download className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {stats.today_count} / {stats.daily_limit}
        </div>
        <div className="mt-4 space-y-2">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            Sisa: {stats.remaining} unduhan
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
