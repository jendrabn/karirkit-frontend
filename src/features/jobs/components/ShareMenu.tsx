import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareMenuProps {
  url: string;
  title: string;
}

export function ShareMenu({ url, title }: ShareMenuProps) {
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Lihat lowongan ${title}`,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Gagal membagikan konten");
        }
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(url);
      toast.success("Tautan disalin ke clipboard");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Bagikan
    </Button>
  );
}
