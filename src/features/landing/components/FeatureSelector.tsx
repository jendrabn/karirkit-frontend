import { Link } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  FeatureIllustration,
  type FeatureIllustrationVariant,
} from "@/features/landing/components/FeatureIllustration";

import iconTracker from "@/assets/images/icon-tracker.png";
import iconSurat from "@/assets/images/icon-surat.png";
import iconCV from "@/assets/images/icon-cv.png";
import iconPortfolio from "@/assets/images/icon-portfolio.png";

const featureMeta = [
  {
    id: "application",
    image: iconTracker,
    href: "/applications",
    illustration: "application" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-secondary via-secondary/50 to-background",
  },
  {
    id: "applicationletter",
    image: iconSurat,
    href: "/application-letters",
    illustration: "applicationletter" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
  },
  {
    id: "cv",
    image: iconCV,
    href: "/cvs",
    illustration: "cv" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-accent via-accent/50 to-background",
  },
  {
    id: "portfolio",
    image: iconPortfolio,
    href: "/portfolios",
    illustration: "portfolio" as FeatureIllustrationVariant,
    bgColor: "bg-gradient-to-br from-muted via-muted/50 to-background",
  },
] as const;

export function FeatureSelector() {
  const { t } = useTranslation("landing");

  const features = featureMeta.map((feature) => ({
    ...feature,
    title: t(`featureSelector.features.${feature.id}.title`),
    subtitle: t(`featureSelector.features.${feature.id}.subtitle`),
  }));

  return (
    <section id="application-tracker" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
            {t("featureSelector.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {t("featureSelector.title")}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t("featureSelector.description")}
          </p>
        </div>

        <Tabs defaultValue="application" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 lg:gap-6 h-auto bg-transparent p-0 mb-12">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="group relative data-[state=active]:bg-card data-[state=active]:border-primary data-[state=active]:shadow-xl border-2 border-border/50 bg-card/50 rounded-2xl p-5 sm:p-6 h-full flex flex-col items-center text-center gap-3 sm:gap-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 group-data-[state=active]:scale-110">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full overflow-hidden space-y-2">
                  <h3 className="font-bold text-base sm:text-lg whitespace-normal break-words leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-data-[state=active]:from-primary group-data-[state=active]:to-primary/80 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground/80 mt-2 hidden sm:block line-clamp-2 whitespace-normal break-words leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                    {feature.subtitle}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {featureMeta.map((feature) => {
            const detail = {
              title: t(`featureSelector.details.${feature.id}.title`),
              description: t(`featureSelector.details.${feature.id}.description`),
              bullets: t(`featureSelector.details.${feature.id}.bullets`, {
                returnObjects: true,
              }) as string[],
              cta: t(`featureSelector.details.${feature.id}.cta`),
              href: feature.href,
              illustration: feature.illustration,
              bgColor: feature.bgColor,
            };

            return (
              <TabsContent
                key={feature.id}
                value={feature.id}
                className="mt-0 animate-in fade-in-50 duration-500"
              >
                <FeatureDetail {...detail} />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}

interface FeatureDetailProps {
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  illustration: FeatureIllustrationVariant;
  bgColor: string;
}

function FeatureDetail({
  title,
  description,
  bullets,
  cta,
  href,
  illustration,
  bgColor,
}: FeatureDetailProps) {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center rounded-3xl p-8 lg:p-12 ${bgColor} border border-border/30`}
    >
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
        <ul className="space-y-4">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-2 w-fit">
          <Link to={href}>{cta}</Link>
        </Button>
      </div>

      <div className="order-first lg:order-last">
        <div className="transform transition-transform duration-300 hover:scale-[1.02]">
          <FeatureIllustration variant={illustration} />
        </div>
      </div>
    </div>
  );
}
