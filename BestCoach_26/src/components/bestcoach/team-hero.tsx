"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/lib/team-data";

export function TeamHero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  // Auto-advance every 5s, pause on hover
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <section
      className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-[#00394f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Team highlights"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className="absolute inset-0 bg-[#00394f] transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 1 }}
        >
          <img
            src={slide.image}
            alt={slide.heading}
            className="size-full object-contain"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001f2e] via-[#00394f]/70 to-[#00394f]/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-6">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-amber-500/90 text-[#001f2e] hover:bg-amber-500">
                  {slide.badge}
                </Badge>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
                  {slide.heading}
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
                  {slide.sub}
                </p>
                {slide.cta && (
                  <Button
                    asChild
                    className="mt-6 h-12 rounded-full bg-amber-500 px-7 text-base font-bold text-[#001f2e] hover:bg-amber-400"
                  >
                    <Link href={slide.cta.href}>
                      {slide.cta.label}
                      <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / next arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-amber-500"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}