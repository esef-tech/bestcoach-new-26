import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Loyalty() {
  return (
    <section
      id="loyalty"
      className="section-pad bg-background"
      aria-labelledby="loyalty-heading"
    >
      <motion.div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/85 px-6 py-12 text-primary-foreground shadow-2xl sm:px-12 sm:py-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
      >
        <span aria-hidden="true" className="music-note-bg text-primary-foreground left-[8%] top-10 text-5xl" style={{ animationDelay: "0.2s" }}>♪</span>
        <span aria-hidden="true" className="music-note-bg text-accent right-[10%] top-16 text-4xl" style={{ animationDelay: "1.4s" }}>♫</span>
        <span aria-hidden="true" className="music-note-bg text-accent left-[40%] bottom-6 text-3xl" style={{ animationDelay: "2.6s" }}>♬</span>
        <span aria-hidden="true" className="music-note-bg text-primary-foreground right-[28%] bottom-12 text-3xl" style={{ animationDelay: "0.8s" }}>♩</span>

        <div className="relative mx-auto max-w-3xl text-center">
          <Badge className="mb-4 bg-primary-foreground/15 text-primary-foreground border-primary-foreground/20">
            <Award className="size-3" /> TLP
          </Badge>
          <h2
            id="loyalty-heading"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
          >
            The Loyalty Project
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85 sm:text-lg">
            Earn rewards, unlock exclusive content and connect deeper with the
            Bestcoach community through The Loyalty Project — our way of giving
            back to dedicated musicians.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-accent text-accent-foreground hover:bg-accent/85"
            >
              <Link href="#contact">
                Join the Loyalty Project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="#events">See our events</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
