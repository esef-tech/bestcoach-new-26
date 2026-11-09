"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/bestcoach/topbar";
import { Navbar } from "@/components/bestcoach/navbar";
import { Footer } from "@/components/bestcoach/footer";
import {
  hero,
  moments,
  whyHeading,
  whyParagraphs,
  fillEyebrow,
  fillHeading,
  fillCards,
  expectHeading,
  timeline,
  perksHeading,
  perks,
  cta,
  testimonials,
} from "@/lib/loyalty-data";

/* ============ Auto-rotating testimonial carousel ============ */
function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <section className="bg-gradient-to-b from-[#04101b] to-[#020a12] px-6 py-16 md:py-20">
      <div
        className="relative mx-auto max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e3854] to-[#0a2c44] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              aria-hidden={i !== index}
              className="absolute inset-0 transition-all duration-700 ease-in-out"
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? "translateX(0)" : "translateX(40px)",
                pointerEvents: i === index ? "auto" : "none",
              }}
            >
              <div className="flex flex-col items-center gap-6 p-8 text-center sm:p-12 md:flex-row md:text-left">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 -m-1 rounded-full bg-[#f59e0b]/40 blur-md" />
                  <img
                    src={t.image}
                    alt={t.who}
                    className="relative size-24 rounded-full border-2 border-[#f59e0b] object-cover shadow-lg sm:size-28"
                  />
                </div>
                {/* Quote */}
                <div className="min-w-0 flex-1">
                  <span className="block font-serif text-4xl leading-none text-[#f59e0b]">
                    ”
                  </span>
                  <blockquote className="mt-1 text-sm font-semibold italic leading-relaxed text-[#eef4f8] sm:text-base">
                    {t.quote}
                  </blockquote>
                  <div className="mt-4 text-base font-extrabold text-white">
                    {t.who}
                  </div>
                  <div className="mt-1 text-xs text-[#9db4c2]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
          {/* Spacer to give the absolute slides height */}
          <div className="pointer-events-none invisible p-8 sm:p-12">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="size-24 shrink-0 sm:size-28" />
              <div className="min-w-0 flex-1">
                <span className="block font-serif text-4xl leading-none">”</span>
                <p className="mt-1 min-h-[80px] text-sm sm:text-base" />
                <div className="mt-4 text-base font-extrabold">.</div>
                <div className="mt-1 text-xs">.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prev / next arrows */}
        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="absolute -left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#3a5b70] bg-transparent text-[#c7d3da] transition hover:bg-[#f59e0b] hover:text-[#1a0f00]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="absolute -right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-[#3a5b70] bg-transparent text-[#c7d3da] transition hover:bg-[#f59e0b] hover:text-[#1a0f00]"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#f59e0b]" : "w-2.5 bg-[#28506a] hover:bg-[#3a5b70]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LoyaltyPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure the background video plays (some browsers need a nudge)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#001a26] text-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        {/* ============ HERO with background video ============ */}
        <section className="relative overflow-hidden px-6 py-20 text-center md:py-28">
          {/* Background video */}
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://bestcoach-front.vercel.app/static/media/Coach.9f8dc9ce950601b9cc93.webp"
          >
            <source src={hero.videoUrl} type="video/mp4" />
          </video>
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020a12]/85 via-[#04121e]/80 to-[#03111c]/90" />

          <div className="relative">
            <div className="font-extrabold uppercase tracking-[0.35em] text-[#f59e0b] text-sm">
              {hero.brand}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[#cfd8dc]">
              {hero.brandSub}
            </div>
            <h1 className="mt-4 font-black leading-[0.95]">
              <span className="block text-6xl text-white drop-shadow-lg sm:text-7xl md:text-8xl lg:text-9xl">
                {hero.line1}
              </span>
              <span className="mt-1 block text-5xl uppercase text-[#f59e0b] drop-shadow-lg sm:text-6xl md:text-7xl">
                {hero.line2}
              </span>
            </h1>
            <p className="mt-6 text-lg tracking-wide text-[#e2e8f0] sm:text-xl">
              {hero.tagline}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="#moments"
                className="rounded-full bg-[#f59e0b] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1a0f00] shadow-[0_0_24px_rgba(245,158,11,0.35)] transition hover:-translate-y-0.5 sm:text-sm"
              >
                {hero.ctaPrimary}
              </Link>
              <button className="rounded-full border border-[#4b5b66] bg-black/30 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition hover:-translate-y-0.5 sm:text-sm">
                {hero.ctaSecondary}
              </button>
            </div>
            <div className="mt-14 flex flex-col items-center text-[11px] uppercase tracking-[0.3em] text-[#7f93a1]">
              {hero.scrollHint}
              <ArrowDown className="mt-2 size-4 text-[#9fb3c0]" />
            </div>
          </div>
        </section>

        {/* ============ TEAM MOMENTS MASONRY (5 real images) ============ */}
        <section
          id="moments"
          className="bg-gradient-to-b from-[#07293f] via-[#0a3049] to-[#082a41] px-6 py-16 md:py-24"
        >
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
            {/* tall image card */}
            <div className="row-span-1 min-h-[220px] overflow-hidden rounded-2xl bg-[#0f3c58] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
              <img
                src={moments[0].image}
                alt={moments[0].caption}
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            {moments.slice(1).map((m, i) => (
              <div
                key={i}
                className={`group relative min-h-[220px] overflow-hidden rounded-2xl bg-[#0f3c58] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.25)] ${
                  i === moments.length - 2 ? "col-span-2 min-h-[240px] sm:col-span-3" : ""
                }`}
              >
                <img
                  src={m.image}
                  alt={m.caption}
                  className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  {m.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ WHY ============ */}
        <section className="bg-black px-6 py-20 text-center md:py-24">
          <h2 className="mx-auto max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
            {whyHeading}
          </h2>
          <div className="mx-auto mt-6 max-w-xl space-y-5">
            {whyParagraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#d7dee3]">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* ============ QUOTE / FILL (6 real images) ============ */}
        <section className="bg-gradient-to-b from-[#0a3350] to-[#0c3c59] px-6 py-24 text-center md:py-28">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#f59e0b]">
            {fillEyebrow}
          </div>
          <h2 className="mt-4 text-4xl font-black leading-[1.05] sm:text-5xl md:text-6xl">
            <span className="mr-3 align-top font-serif text-[#f59e0b]">“</span>
            {fillHeading}
            <span className="ml-3 align-bottom font-serif text-[#f59e0b]">”</span>
          </h2>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {fillCards.map((c, i) => (
              <div
                key={i}
                className="group relative min-h-[180px] overflow-hidden rounded-2xl bg-[#0f3c58] shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.caption}
                    className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  {c.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ WHAT TO EXPECT TIMELINE ============ */}
        <section className="bg-white px-6 py-24 text-[#1a1a1a] md:py-28">
          <h2 className="mx-auto mb-16 max-w-xl text-center text-3xl font-extrabold text-[#111] sm:text-4xl">
            {expectHeading}
          </h2>
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute bottom-10 left-[29px] top-8 w-[3px] bg-[#f59e0b]" />
            <div className="space-y-14">
              {timeline.map((s) => (
                <div key={s.num} className="relative flex gap-6">
                  <div className="relative z-10 flex size-15 shrink-0 items-center justify-center rounded-full bg-[#f59e0b] text-lg font-extrabold text-white shadow-[0_6px_16px_rgba(245,158,11,0.4)]">
                    {s.num}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-extrabold text-[#111]">
                      <span className="mr-2">{s.emoji}</span>
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
                      {s.desc}
                    </p>
                    {s.note && (
                      <p className="mt-2 text-sm italic text-[#6b7280]">{s.note}</p>
                    )}
                    {s.list && (
                      <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-[#4b5563]">
                        {s.list.map((li, i) => (
                          <li key={i}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PERKS & BENEFITS ============ */}
        <section className="bg-black px-6 py-20 md:py-24">
          <h2 className="mb-14 text-center text-3xl font-extrabold sm:text-4xl">
            {perksHeading}
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-12">
            {perks.map((p, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#262626] bg-[#141414] text-xl">
                  {p.emoji}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#f59e0b]">{p.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#b8c0c6]">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="bg-[radial-gradient(1200px_500px_at_50%_0%,#155273_0%,#0c3c59_45%,#08293f_100%)] px-6 py-24 text-center md:py-28">
          <h2 className="mx-auto max-w-xl text-3xl font-extrabold leading-tight text-[#f59e0b] sm:text-4xl md:text-5xl">
            {cta.heading}
          </h2>
          <div className="mx-auto mt-6 max-w-lg space-y-4">
            {cta.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#dce6ec] sm:text-base">
                {p}
              </p>
            ))}
          </div>
          <p className="mt-7 text-base font-semibold italic text-[#dce6ec]">
            {cta.motto}
          </p>
          <Link
            href="/signup"
            className="mt-9 inline-block rounded-full bg-[#f59e0b] px-10 py-4 text-sm font-bold uppercase tracking-wider text-[#1a0f00] shadow-[0_0_24px_rgba(245,158,11,0.35)] transition hover:-translate-y-0.5"
          >
            {cta.button} <ArrowRight className="ml-1 inline size-4" />
          </Link>
        </section>

        {/* ============ TESTIMONIAL CAROUSEL (animated) ============ */}
        <TestimonialCarousel />
      </main>
      <Footer />
    </div>
  );
}