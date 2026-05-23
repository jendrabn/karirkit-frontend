import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { paths } from "@/config/paths";
import { seoConfig } from "@/config/seo";
import logo from "@/assets/images/logo.png";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";

const facebookLogoSrc =
  "https://commons.wikimedia.org/wiki/Special:FilePath/2021_Facebook_icon.svg";
const appleLogoSrc =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Apple_logo_black.svg";

const socialButtons = [
  {
    label: "Lanjutkan dengan Facebook",
    iconSrc: facebookLogoSrc,
    disabled: true,
  },
  {
    label: "Lanjutkan dengan Apple",
    iconSrc: appleLogoSrc,
    disabled: true,
    iconClassName: "dark:invert",
  },
] as const;

const policyLinks = [
  { label: "Ketentuan Layanan", href: "#" },
  { label: "Kebijakan Privasi", href: "#" },
] as const;

type SocialButtonProps = {
  label: string;
  iconSrc: string;
  disabled?: boolean;
  iconClassName?: string;
};

function SocialButton({
  label,
  iconSrc,
  disabled = false,
  iconClassName,
}: SocialButtonProps) {
  return (
    <Button
      variant="auth"
      size="default"
      className="relative w-full justify-center"
      disabled={disabled}
      title={disabled ? "Coming soon" : undefined}
    >
      <span className="absolute left-4 inline-flex size-4 items-center justify-center">
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          className={cn("size-4 shrink-0", iconClassName)}
        />
      </span>
      <span>{label}</span>
    </Button>
  );
}

function AuthBrand() {
  return (
    <img
      src={logo}
      alt="KarirKit"
      className="h-8 w-auto sm:h-10 dark:[filter:brightness(0)_invert(1)]"
    />
  );
}

function AuthCopy() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
        Selamat Datang di KarirKit
      </h1>
      <p className="text-sm leading-6 text-muted-foreground">
        Silakan masuk untuk melanjutkan ke akunmu dan menggunakan KarirKit.
      </p>
    </div>
  );
}

function AuthActions() {
  return (
    <div className="flex w-full flex-col gap-3">
      <GoogleLoginButton />
      {socialButtons.map((button) => (
        <SocialButton key={button.label} {...button} />
      ))}
    </div>
  );
}

function AuthPolicyNotice() {
  return (
    <p className="text-xs leading-6 text-muted-foreground">
      Dengan menekan lanjutkan, kamu menyetujui{" "}
      {policyLinks.map((link, index) => (
        <span key={link.label}>
          {index > 0 ? " dan " : ""}
          <a
            href={link.href}
            onClick={(event) => event.preventDefault()}
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
          >
            {link.label}
          </a>
        </span>
      ))}
      .
    </p>
  );
}

export default function Auth() {
  return (
    <>
      <SEO
        title={seoConfig.auth.title}
        description={seoConfig.auth.description}
        url={paths.auth.getHref()}
        noIndex
      />

      <main className="min-h-dvh bg-background text-foreground">
        <div className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <section className="w-full max-w-sm">
            <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
              <AuthBrand />
              <AuthCopy />
              <AuthActions />
              <AuthPolicyNotice />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
