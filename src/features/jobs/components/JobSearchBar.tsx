import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JobSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function JobSearchBar({ value, onChange, onSearch }: JobSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative group max-w-2xl mx-auto w-full">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-md group-hover:blur-lg transition-all duration-500 opacity-50 group-hover:opacity-100" />

      {/* Main Search Bar */}
      <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-primary/20 rounded-full shadow-lg p-2 pl-4 transition-all duration-300 hover:border-primary/40 hover:shadow-primary/5">
        <Search className="h-5 w-5 text-primary shrink-0 mr-3" />
        <Input
          placeholder="Cari posisi, perusahaan..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent h-10 sm:h-12 text-base sm:text-lg placeholder:text-muted-foreground/50 px-0"
        />
        <Button
          onClick={onSearch}
          size="lg"
          className="rounded-full px-6 sm:px-8 h-10 sm:h-12 text-base font-medium shadow-none hover:shadow-md transition-all ml-2"
        >
          <span className="lg:hidden">Cari</span>
          <span className="hidden lg:inline">Cari Lowongan</span>
        </Button>
      </div>
    </div>
  );
}
