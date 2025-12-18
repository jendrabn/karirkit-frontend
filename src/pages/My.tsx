import { useParams, Link } from "react-router";
import { Calendar, Briefcase, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPortfolioListData } from "@/data/mockPortfolios";
import { projectTypeLabels } from "@/types/portfolio";

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const My = () => {
  const { username } = useParams<{ username: string }>();
  const data = getPortfolioListData(username || "");

  if (!data) {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Profile Section */}
      <section className="py-16 px-4 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center animate-fade-in">
            <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {user.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              @{user.username}
            </p>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              {user.headline}
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="flex-1 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Portfolio ({portfolios.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((portfolio) => (
              <Link
                key={portfolio.id}
                to={`/me/${username}/${portfolio.id}`}
                className="group"
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
                  {/* Cover Image */}
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={portfolio.cover}
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge
                      className="absolute top-4 left-4"
                      variant="secondary"
                    >
                      {projectTypeLabels[portfolio.project_type]}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {portfolio.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {portfolio.sort_description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {portfolio.role_title}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {monthNames[portfolio.month - 1]} {portfolio.year}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{portfolio.industry}</span>
                    </div>

                    {/* Tools */}
                    <div className="flex flex-wrap gap-2">
                      {portfolio.tools.slice(0, 4).map((tool) => (
                        <Badge
                          key={tool.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {tool.name}
                        </Badge>
                      ))}
                      {portfolio.tools.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{portfolio.tools.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {portfolios.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Belum ada portfolio yang ditambahkan.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default My;
