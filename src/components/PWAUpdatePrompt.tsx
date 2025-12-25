import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error: unknown) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
  };

  const reload = () => {
    updateServiceWorker(true);
  };

  if (!showReload && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {needRefresh ? "Update Tersedia" : "Siap untuk Offline"}
          </CardTitle>
          <CardDescription>
            {needRefresh
              ? "Versi baru aplikasi tersedia. Muat ulang untuk update."
              : "Aplikasi siap bekerja secara offline."}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button variant="outline" onClick={close} className="flex-1">
            {needRefresh ? "Nanti" : "Tutup"}
          </Button>
          {needRefresh && (
            <Button onClick={reload} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Muat Ulang
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
