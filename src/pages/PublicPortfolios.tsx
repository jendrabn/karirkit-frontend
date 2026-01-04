import { useParams, Link } from "react-router";
import {
  Calendar,
  Briefcase,
  MapPin,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePublicPortfolios } from "@/features/public/api/get-public-portfolios";
import { projectTypeLabels } from "@/types/portfolio";
import type { SocialPlatform } from "@/types/social";
import { buildImageUrl } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { env } from "@/config/env";
import { getSocialIcon } from "@/lib/socials";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function PublicPortfolios() {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, error } = usePublicPortfolios({
    username: username!,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              User tidak ditemukan
            </h1>
            <p className="text-muted-foreground mt-2">
              Portfolio dengan username tersebut tidak tersedia.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, portfolios } = data;

  const workCount = portfolios.filter((p) => p.project_type === "work").length;
  const toolCount = new Set(
    portfolios.flatMap((p) => p.tools.map((t) => t.name))
  ).size;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.name,
      alternateName: user.username,
      description:
        user.headline ||
        user.bio ||
        "Profesional dengan portofolio karya digital.",
      image: user.avatar ? buildImageUrl(user.avatar) : undefined,
      url: `${env.APP_URL}/u/${user.username}`,
      sameAs: portfolios.map((p) => `${env.APP_URL}/u/${user.username}/${p.id}`),
    },
  };

  const socialLinks = user.social_links || [];

  return (
    <>
      <SEO
        title={`${user.name} - Portofolio Digital`}
        description={`Lihat portofolio digital dari ${user.name}. ${
          user.headline || "Profesional dengan berbagai proyek dan pengalaman."
        }`}
        keywords={`portofolio ${user.name}, ${user.username}, proyek profesional, karya digital`}
        image={user.avatar ? buildImageUrl(user.avatar) : undefined}
        url={`/u/${user.username}`}
        type="profile"
        structuredData={structuredData}
      />

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-background" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          <div className="container relative mx-auto px-4 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 animate-fade-in">
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary/50 rounded-full blur-lg opacity-50" />
                  <Avatar className="relative h-36 w-36 lg:h-44 lg:w-44 ring-4 ring-background shadow-2xl">
                    <AvatarImage src={buildImageUrl(user.avatar)} alt={user.name} />
                    <AvatarFallback className="text-5xl lg:text-6xl bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2">
                    {user.name}
                  </h1>
                  <p className="text-lg text-primary font-medium mb-3">
                    @{user.username}
                  </p>
                  {user.headline && (
                    <p className="text-xl text-foreground/80 mb-4 max-w-2xl">
                      {user.headline}
                    </p>
                  )}
                  {user.location && (
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.bio && (
                    <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">
                      {user.bio}
                    </p>
                  )}

                  {socialLinks.length > 0 && (
                    <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                      {socialLinks.map((social) => (
                        <Button
                          key={social.id ?? social.platform + social.url}
                          variant="outline"
                          size="icon"
                          asChild
                          className="rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={social.platform}
                          >
                            {getSocialIcon(social.platform as SocialPlatform)}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{portfolios.length}</p>
                <p className="text-sm text-muted-foreground">Total Proyek</p>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-primary">{workCount}</p>
                <p className="text-sm text-muted-foreground">Pekerjaan</p>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-primary">{toolCount}</p>
                <p className="text-sm text-muted-foreground">Teknologi</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Portfolio
              </h2>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {portfolios.length} Proyek
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {portfolios.map((portfolio, index) => (
                <Link
                  key={portfolio.id}
                  to={`/u/@${username}/${portfolio.id}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Card className="overflow-hidden h-full bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 group-hover:border-primary/30">
                    <div className="aspect-16/10 relative overflow-hidden">
                      <img
                        src={buildImageUrl(portfolio.cover)}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="flex gap-2">
                          {portfolio.live_url && (
                            <Badge
                              variant="secondary"
                              className="bg-background/90 backdrop-blur-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live Demo
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Badge
                        className="absolute top-4 left-4"
                        variant="secondary"
                      >
                        {projectTypeLabels[portfolio.project_type]}
                      </Badge>
                    </div>

                    <CardContent className="p-5 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {portfolio.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {portfolio.sort_description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-primary/70" />
                          {portfolio.role_title}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary/70" />
                          {monthNames[portfolio.month - 1]} {portfolio.year}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {portfolio.tools.slice(0, 3).map((tool) => (
                          <Badge
                            key={tool.id}
                            variant="outline"
                            className="text-xs font-normal px-2 py-0.5 bg-muted/50"
                          >
                            {tool.name}
                          </Badge>
                        ))}
                        {portfolio.tools.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal px-2 py-0.5 bg-muted/50"
                          >
                            +{portfolio.tools.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {portfolios.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <Briefcase className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">
                  Belum ada portfolio yang ditambahkan.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
