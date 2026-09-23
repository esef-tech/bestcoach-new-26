"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { packages, contactInfo } from "@/lib/data";

function SafeImage({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? fallbackSrc : src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background section-pad"
      aria-labelledby="hero-heading"
    >
      <span aria-hidden="true" className="music-note-bg text-primary left-[6%] top-24" style={{ animationDelay: "0.2s" }}>♪</span>
      <span aria-hidden="true" className="music-note-bg text-accent left-[20%] top-56" style={{ animationDelay: "1.4s" }}>♫</span>
      <span aria-hidden="true" className="music-note-bg text-primary right-[8%] top-32" style={{ animationDelay: "2.6s" }}>♬</span>
      <span aria-hidden="true" className="music-note-bg text-accent right-[18%] top-72" style={{ animationDelay: "0.8s" }}>♩</span>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Badge className="w-fit gap-1.5 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="size-3" /> Bestcoach Music 🎶
          </Badge>
          <h1
            id="hero-heading"
            className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Welcome to Bestcoach Music 🎶
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Unlock your musical potential with us! Join our vibrant community and take
            your skills to the next level. Whether you&apos;re a beginner or a seasoned
            musician, we have something for everyone. Get started today and let the
            music flow! 🎸🎤
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              asChild
              className="h-12 bg-accent text-accent-foreground hover:bg-accent/85"
            >
              <Link href={contactInfo.linktree} target="_blank" rel="noopener noreferrer">
                Follow Us For More
                <ExternalLink className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12">
              <Link href="#programs">View Programs</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-2xl">
            <div className="aspect-[4/3] w-full">
              <SafeImage
                src="/bestcoach-hero.jpg"
                fallbackSrc={packages[1].img}
                alt="A Bestcoach Music lesson in progress"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
            <span
              aria-hidden="true"
              className="music-note-bg text-accent left-4 top-4"
              style={{ animationDelay: "0.4s" }}
            >
              ♫
            </span>
            <span
              aria-hidden="true"
              className="music-note-bg text-primary right-4 bottom-4"
              style={{ animationDelay: "1.8s" }}
            >
              ♬
            </span>
          </div>
          <div className="glass absolute -bottom-5 -left-3 hidden rounded-2xl px-4 py-3 sm:block">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Since</p>
            <p className="text-2xl font-bold text-primary">2003</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
