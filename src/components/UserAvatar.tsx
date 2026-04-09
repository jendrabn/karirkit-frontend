import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Avatar className={className}>
      <AvatarImage
        src={src ? buildImageUrl(src) : undefined}
        className="object-cover"
      />
      <AvatarFallback className={fallbackClassName || "bg-primary/10 text-primary font-medium"}>
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}