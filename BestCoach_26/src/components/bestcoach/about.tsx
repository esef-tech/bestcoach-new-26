import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  History,
  Users,
  Heart,
  BadgeCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { timeline, metrics } from "@/lib/data";

export function About() {
  return (
    <section
      id="about"
      className="section-pad bg-background"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Sub-banner */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 px-6 py-12 text-center text-primary-foreground shadow-lg sm:px-12 sm:py-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span aria-hidden="true" className="music-note-bg text-primary-foreground left-6 top-6 text-5xl" style={{ animationDelay: "0.2s" }}>♪</span>
          <span aria-hidden="true" className="music-note-bg text-accent right-8 top-10 text-4xl" style={{ animationDelay: "1.4s" }}>♫</span>
          <span aria-hidden="true" className="music-note-bg text-primary-foreground left-1/2 bottom-6 text-3xl" style={{ animationDelay: "2.6s" }}>♬</span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Life is better with music
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/85 sm:text-lg">
            Learn how to play piano, whenever you want, wherever you want.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          className="mt-14 grid items-center gap-8 md:grid-cols-2"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Badge className="mb-3 bg-accent/15 text-accent border-accent/30">
              <Target className="size-3" /> Our Mission
            </Badge>
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Music education without barriers
            </h3>
          </div>
          <p className="text-muted-foreground sm:text-lg">
            To spread music education widely and remove barriers of age or
            location for learning music.
          </p>
        </motion.div>

        {/* History */}
        <div className="mt-16">
          <motion.div
            className="mb-6 flex items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <History className="size-5 text-accent" />
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Our History
            </h3>
          </motion.div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map((item, i) => (
              <motion.li
                key={item.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col gap-2 p-5">
                    <span className="text-3xl font-extrabold text-amber-accent">
                      {item.year}
                    </span>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Founder story */}
        <motion.div
          className="mt-16 grid items-center gap-8 rounded-3xl border bg-card p-6 md:grid-cols-2 md:p-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="/bestcoach-about.jpg"
              alt="Mr. Emmanuel Ameko, founder of Bestcoach Music"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.squarespace-cdn.com/content/v1/6213f6b6150312039937363e/4bd42772-e43d-4891-97b2-2f7cc06d9e47/20231217__A7C1741.jpg";
              }}
            />
            <span aria-hidden="true" className="music-note-bg text-accent right-3 top-3 text-3xl">
              ♬
            </span>
          </div>
          <div>
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
              <BadgeCheck className="size-3" /> Our Founder
            </Badge>
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              It all started with a passion for music…
            </h3>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Mr. Emmanuel Ameko founded Bestcoach Music with a singular vision:
              to make world-class music education accessible to everyone,
              regardless of age or location. What began as a small studio has
              grown into a vibrant community of musicians, vocalists and
              engineers across Ghana and beyond.
            </p>
            <p className="mt-3 text-muted-foreground">
              Today, Bestcoach Music continues to honor that founding mission —
              nurturing the next generation of artists, one lesson at a time.
            </p>
          </div>
        </motion.div>

        {/* Community metrics */}
        <div className="mt-16">
          <motion.div
            className="mb-6 flex items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <Users className="size-5 text-accent" />
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Our Community
            </h3>
          </motion.div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {metrics.map((m, i) => (
              <motion.li
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              >
                <div className="glass flex h-full flex-col items-center gap-1 rounded-2xl p-5 text-center">
                  <span className="text-3xl font-extrabold text-amber-accent">
                    {m.value}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </span>
                  <Heart className="mt-1 size-3 text-accent/60" aria-hidden="true" />
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
