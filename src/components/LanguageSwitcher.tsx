import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "id", label: "Indonesia", flag: "ID" },
  { code: "en", label: "English", flag: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation("common");

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          {currentLang.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={currentLang.code === lang.code ? "bg-accent" : ""}
          >
            <span>
              {lang.code === "id" ? t("userMenu.languageId") : t("userMenu.languageEn")}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
