import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Music2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/data";
import {
  Piano,
  Drum,
  Guitar,
  Music4,
  AudioWaveform,
  Wrench,
  ShoppingCart,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  piano: Piano,
  drum: Drum,
  guitar: Guitar,
  trumpet: Music4,
  clarinet: Music4,
  theory: Music4,
  sound: AudioWaveform,
  production: SlidersHorizontal,
  rental: ShoppingCart,
  repair: Wrench,
  purchase: ShoppingCart,
  workshop: Users,
  instrumentation: Wrench,
};

export function Services() {
  return (
    <section
      id="services"
      className="section-pad bg-muted/30"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="size-3" /> Our Offerings
          </Badge>
          <h2
            id="services-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Our Services
          </h2>
          <p className="mt-3 text-muted-foreground">
            From instrument lessons to sound engineering — Bestcoach Music
            covers your every musical need.
          </p>
        </motion.div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = ICON_MAP[s.icon] ?? Music2;
            return (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              >
                <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-accent/40">
                  <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                    <span
                      aria-hidden="true"
                      className="grid size-12 place-items-center rounded-full bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110"
                    >
                      <Icon className="size-6" />
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {s.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-10 text-center">
          <p className="text-muted-foreground">
            Need something specific?{" "}
            <Link
              href="#contact"
              className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Make a special request
              <ArrowRight className="size-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
