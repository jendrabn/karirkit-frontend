import { useParams, Link, useNavigate } from "react-router";
import {
  ExternalLink,
  Github,
  Calendar,
  Briefcase,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPortfolioDetailData } from "@/data/mockPortfolios";
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

export default function PublicPortfolioShow() {
  const { username, id } = useParams<{ username: string; id: string }>();
  const navigate = useNavigate();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const data = getPortfolioDetailData(username || "", id || "");

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Portfolio tidak ditemukan
            </h1>
            <p className="text-muted-foreground mt-2">
              Portfolio yang Anda cari tidak tersedia.
            </p>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, portfolio } = data;

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === portfolio.medias.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? portfolio.medias.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to={`/me/${username}`}
              className="hover:text-primary transition-colors"
            >
              {user.name}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">
              {portfolio.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Content - 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Cover Image */}
              <div className="aspect-video rounded-xl overflow-hidden bg-muted shadow-lg">
                <img
                  src={portfolio.cover}
                  alt={portfolio.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Meta */}
              <div>
                <Badge className="mb-4" variant="secondary">
                  {projectTypeLabels[portfolio.project_type]}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {portfolio.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {portfolio.sort_description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {portfolio.live_url && (
                  <Button size="lg" asChild>
                    <a
                      href={portfolio.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Lihat Live Demo
                    </a>
                  </Button>
                )}
                {portfolio.repo_url && (
                  <Button size="lg" variant="outline" asChild>
                    <a
                      href={portfolio.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Tentang Proyek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {portfolio.description
                      .split("\n\n")
                      .map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="mb-4 last:mb-0 leading-relaxed text-foreground/90"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Media Gallery */}
              {portfolio.medias.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Galeri Proyek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={portfolio.medias[currentMediaIndex].path}
                          alt={portfolio.medias[currentMediaIndex].caption}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {portfolio.medias.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-3 top-1/2 -translate-y-1/2 shadow-lg"
                            onClick={prevMedia}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-3 top-1/2 -translate-y-1/2 shadow-lg"
                            onClick={nextMedia}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground text-center mt-4">
                      {portfolio.medias[currentMediaIndex].caption}
                    </p>

                    {/* Thumbnails */}
                    {portfolio.medias.length > 1 && (
                      <div className="flex gap-3 mt-4 justify-center flex-wrap">
                        {portfolio.medias.map((media, idx) => (
                          <button
                            key={media.id}
                            onClick={() => setCurrentMediaIndex(idx)}
                            className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentMediaIndex
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={media.path}
                              alt={media.caption}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Author Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dibuat oleh</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/me/${username}`}
                    className="flex items-center gap-4 group"
                  >
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.headline}
                  </p>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to={`/me/${username}`}>Lihat Semua Portfolio</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detail Proyek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Peran</p>
                      <p className="font-medium">{portfolio.role_title}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Industri</p>
                      <p className="font-medium">{portfolio.industry}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Periode</p>
                      <p className="font-medium">
                        {monthNames[portfolio.month - 1]} {portfolio.year}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Teknologi yang Digunakan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tools.map((tool) => (
                      <Badge
                        key={tool.id}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {tool.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Back Button */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate(`/me/${username}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Portfolio
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
