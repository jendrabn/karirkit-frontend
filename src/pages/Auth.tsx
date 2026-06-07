import { SEO } from "@/components/SEO";
import { paths } from "@/config/paths";
import { seoConfig } from "@/config/seo";
import logo from "@/assets/images/logo.png";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { Link } from "react-router";

const policyLinks = [
  { label: "Ketentuan Layanan", href: "#" },
  { label: "Kebijakan Privasi", href: "#" },
] as const;

function AuthBrand() {
  return (
    <Link
      to={paths.home.getHref()}
      aria-label="Kembali ke beranda KarirKit"
      className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <img
        src={logo}
        alt="KarirKit"
        className="h-8 w-auto sm:h-10 dark:[filter:brightness(0)_invert(1)]"
      />
    </Link>
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
    <SocialAuthButtons />
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
