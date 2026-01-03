import { HardDrive, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { formatBytes } from "@/lib/utils";

export function DocumentStorageWidget() {
  const { user, isLoading } = useAuth();
  const storageStats = user?.document_storage_stats;
  const storageLimit = user?.document_storage_limit ?? storageStats?.limit ?? 0;
  const storageUsed = storageStats?.used ?? 0;
  const storageRemaining =
    storageStats?.remaining ?? Math.max(storageLimit - storageUsed, 0);

  const percentage = storageLimit
    ? Math.min(100, Math.round((storageUsed / storageLimit) * 100))
    : 0;

  if (isLoading || !user) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Penggunaan Penyimpanan
          </CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex h-[80px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!storageStats && storageLimit === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Penggunaan Penyimpanan
        </CardTitle>
        <HardDrive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
        </div>
        <div className="mt-4 space-y-2">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            Tersisa: {formatBytes(storageRemaining)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
