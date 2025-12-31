import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, type BreadcrumbItemType } from "@/components/Breadcrumb";

export type { BreadcrumbItemType };

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItemType[];
}

export function DashboardLayout({
  children,
  breadcrumbItems,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
          </header>
          <div className="flex-1 p-6 lg:p-8 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
