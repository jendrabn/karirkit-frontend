import { useState } from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnVisibility {
  user: boolean;
  plan: boolean;
  status: boolean;
  amount: boolean;
  payment_type: boolean;
  order_id: boolean;
  expires_at: boolean;
  created_at: boolean;
}

const columnOrder: (keyof ColumnVisibility)[] = [
  "user",
  "plan",
  "status",
  "amount",
  "payment_type",
  "order_id",
  "expires_at",
  "created_at",
];

const columnLabels: Record<keyof ColumnVisibility, string> = {
  user: "Pengguna",
  plan: "Plan",
  status: "Status",
  amount: "Nominal",
  payment_type: "Tipe Pembayaran",
  order_id: "Order ID",
  expires_at: "Aktif Sampai",
  created_at: "Dibuat",
};

interface ColumnToggleProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function SubscriptionColumnToggle({
  visibility,
  onVisibilityChange,
}: ColumnToggleProps) {
  const [open, setOpen] = useState(false);

  const toggleColumn = (column: keyof ColumnVisibility) => {
    onVisibilityChange({
      ...visibility,
      [column]: !visibility[column],
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-50 max-h-80 w-56 overflow-y-auto bg-popover"
      >
        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnOrder.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={visibility[column]}
            onCheckedChange={() => toggleColumn(column)}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
