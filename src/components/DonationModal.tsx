import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const handleDonate = () => {
    window.open("https://saweria.co/karirkit", "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-xl">
            Dukung Operasional KarirKit
          </DialogTitle>
          <DialogDescription className="text-left text-base leading-relaxed">
            KarirKit berjalan tanpa iklan dan paywall untuk mendukung pencari
            kerja di Indonesia, dan donasi Anda membantu kami membiayai server,
            pemeliharaan sistem, serta pengembangan fitur agar layanan ini terus
            berjalan dan berkembang.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={handleDonate} className="w-full" size="lg">
            Donasi via Saweria
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Nanti Saja
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
