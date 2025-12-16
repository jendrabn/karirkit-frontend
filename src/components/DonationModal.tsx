import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Server, Wrench, Code } from "lucide-react";

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
          <DialogTitle className="text-xl">Dukung Operasional KarirKit</DialogTitle>
          <DialogDescription className="text-left text-base leading-relaxed">
            KarirKit berjalan tanpa iklan dan tanpa paywall—semua demi memberikan akses mudah bagi setiap pencari kerja. Agar layanan ini tetap hidup dan terus berkembang, kami membutuhkan dukungan Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="font-medium text-foreground">Donasi Anda akan digunakan untuk:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Server className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Biaya server & penyimpanan data</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Maintenance dan peningkatan performa</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Code className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Mendukung tim developer dalam pengembangan fitur</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground pt-2">
            Setiap donasi adalah investasi untuk masa depan para pencari kerja di Indonesia. Terima kasih atas dukungan Anda!
          </p>
        </div>

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
