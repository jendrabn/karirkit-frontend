import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backButtonUrl?: string;
}

export function PageHeader({
  title,
  subtitle,
  children,
  showBackButton,
  backButtonUrl,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {showBackButton && backButtonUrl && (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link to={backButtonUrl} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Link>
        </Button>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
