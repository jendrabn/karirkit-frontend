import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
    <div className="max-w-md w-full text-center space-y-8">
      {/* 404 Text with Animation */}
      <div className="relative">
        <div className="text-9xl font-bold text-primary/10 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-gradient">404</div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="default" className="gap-2">
          <Link to={paths.home.getHref()}>
            <Home className="h-4 w-4" />
            Beranda
          </Link>
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>
    </div>
  </div>
);

export default NotFound;
