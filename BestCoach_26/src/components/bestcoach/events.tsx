import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { events, contactInfo } from "@/lib/data";

export function Events() {
  return (
    <section
      id="events"
      className="section-pad bg-muted/30"
      aria-labelledby="events-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-3 bg-accent/15 text-accent border-accent/30">
            <CalendarDays className="size-3" /> Events
          </Badge>
          <h2
            id="events-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Join Our Flagship Events
          </h2>
          <p className="mt-3 text-muted-foreground">
            Two flagship gatherings designed to help you grow, perform and
            connect with the Bestcoach community.
          </p>
        </motion.div>

        <div className="flex flex-col gap-10 lg:gap-16">
          {events.map((ev, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.article
                key={ev.id}
                className={`grid items-center gap-6 rounded-3xl border bg-card p-4 md:grid-cols-2 md:p-6 ${
                  reversed ? "" : ""
                }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                {/* Image side */}
                <div
                  className={`relative overflow-hidden rounded-2xl ${
                    reversed ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <img
                    src={ev.img}
                    alt={ev.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.squarespace-cdn.com/content/v1/6213f6b6150312039937363e/4bd42772-e43d-4891-97b2-2f7cc06d9e47/20231217__A7C1741.jpg";
                    }}
                  />
                  <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground shadow-md">
                    {ev.short}
                  </Badge>
                </div>

                {/* Text side */}
                <div
                  className={`flex flex-col gap-3 ${
                    reversed ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-accent">
                    Featured Event
                  </span>
                  <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                    {ev.title}
                  </h3>
                  <p className="text-muted-foreground sm:text-lg">{ev.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Button asChild className="h-11 bg-accent text-accent-foreground hover:bg-accent/85">
                      <Link href={contactInfo.linktree} target="_blank" rel="noopener noreferrer">
                        Register <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11">
                      <Link href="#contact">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
