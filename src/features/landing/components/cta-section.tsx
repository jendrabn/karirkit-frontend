import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/motion";

const benefits = [
  "Mulai dari plan Free",
  "Upgrade ke Pro atau Max",
  "Template premium untuk CV dan surat lamaran",
];

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-primary-foreground rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight"
            variants={fadeUp}
          >
            Mulai dari Free, Upgrade Saat Butuh Lebih
          </motion.h2>

          <motion.p
            className="text-primary-foreground/90 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
          >
            Kelola lamaran, buat CV dan surat lamaran, simpan dokumen, lalu upgrade ke Pro atau Max untuk membuka template premium dan limit yang lebih besar.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 lg:gap-6"
            variants={staggerContainer}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-primary-foreground"
                variants={staggerItem}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={fadeUp}
          >
            <Button
              size="lg"
              className="bg-background text-primary hover:bg-background/90 h-14 px-10 text-base font-semibold shadow-2xl group"
              asChild
            >
              <Link to={paths.auth.getHref()}>
                Buat Akun Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 h-14 px-10 text-base font-medium"
              asChild
            >
              <Link to={paths.subscriptions.list.getHref()}>Lihat Paket Langganan</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
