"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Users,
  UserPlus,
  Maximize2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TopBar } from "@/components/bestcoach/topbar";
import { Navbar } from "@/components/bestcoach/navbar";
import { Footer } from "@/components/bestcoach/footer";
import { FacebookIcon } from "@/components/bestcoach/facebook-icon";
import { TeamHero } from "@/components/bestcoach/team-hero";
import {
  teamHeroSlides,
  teamMembers,
  teamStats,
  type TeamMember,
} from "@/lib/team-data";

/* Inline brand SVGs for the socials lucide doesn't ship */
function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.93-1.31 1.92-3.58 3.09-5.93 3.13-1.43.08-2.86-.31-4.07-1.08-2.04-1.27-3.33-3.62-3.28-6.03-.02-2.41 1.37-4.75 3.44-5.97 1.33-.79 2.93-1.04 4.48-.85.02 1.49-.02 2.97.02 4.46-.72-.24-1.51-.28-2.23-.05-1.04.31-1.9 1.19-2.13 2.25-.21.81-.04 1.7.43 2.4.71 1.09 2.15 1.66 3.42 1.31 1.18-.31 2.06-1.43 2.13-2.64.03-2.21.01-4.42.02-6.62.01-3.79 0-7.59.01-11.38z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socialIcon: Record<string, (p: { className?: string }) => React.ReactNode> = {
  WhatsApp: WhatsappIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TiktokIcon,
  YouTube: YouTubeIcon,
};

export default function TeamPage() {
  const [photo, setPhoto] = useState<TeamMember | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        {/* Auto-rotating hero gallery */}
        <TeamHero slides={teamHeroSlides} />

        {/* Intro / mission */}
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <Badge className="mb-3 bg-accent/20 text-accent-foreground">
              The Bestcoach Family
            </Badge>
            <h2 className="text-3xl font-bold text-[#00394f] md:text-4xl">
              The people who make the music happen
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Our coaches, mentors and creatives are the heartbeat of Bestcoach
              Music. From vocal technique to instrumentation, sound engineering
              to community, each one is here to help you grow — wherever you are
              on your musical journey.
            </p>

            {/* Stats */}
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
              {teamStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border bg-card p-5 text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#00394f]">
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team grid */}
        <section id="team" className="bg-muted/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <Badge className="mb-3 bg-accent/20 text-accent-foreground">
                Our Team
              </Badge>
              <h2 className="text-3xl font-bold text-[#00394f] md:text-4xl">
                Meet the executives
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                A small, dedicated team building a big musical community. Click
                a photo to view it full size.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((m) => (
                <article
                  key={m.id}
                  className="group overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="size-full object-contain"
                    />
                    <button
                      onClick={() => setPhoto(m)}
                      aria-label={`View ${m.name}'s photo full size`}
                      className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/85 text-[#00394f] shadow backdrop-blur transition hover:scale-110 hover:bg-white"
                    >
                      <Maximize2 className="size-4" />
                    </button>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                    {/* Social icons overlay */}
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-0 transition group-hover:opacity-100">
                      {m.socials.map((s) => {
                        const Icon = socialIcon[s.label] ?? ((p: { className?: string }) => null);
                        return (
                          <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${m.name} on ${s.label}`}
                            className="grid size-9 place-items-center rounded-full bg-white/90 text-[#00394f] shadow transition hover:bg-white"
                          >
                            {typeof Icon === "function" ? (
                              <Icon className="size-4" />
                            ) : (
                              Icon
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#00394f]">
                      {m.name}
                    </h3>
                    <p className="text-sm font-medium text-amber-600">
                      {m.role}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {m.bio}
                    </p>
              <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPhoto(m)}
                      className="mt-4 w-full rounded-full border-[#00394f]/30 text-[#00394f] hover:bg-[#00394f] hover:text-white"
                    >
                      <Maximize2 className="size-4" /> View photo
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-[#00394f] to-[#001f2e] py-16 md:py-24 text-center text-white">
          <div className="mx-auto max-w-3xl px-6">
            <Users className="mx-auto mb-4 size-10 text-amber-500" />
            <h2 className="text-3xl font-bold md:text-4xl">
              Want to join our team?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              We&apos;re always looking for passionate coaches and creatives.
              Reach out and let&apos;s make music together. 🎶
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="h-12 rounded-full bg-amber-500 px-7 text-base font-bold text-[#001f2e] hover:bg-amber-400"
              >
                <Link href="/#contact">
                  <Phone className="mr-1 size-4" /> Contact us
                </Link>
              </Button>
                           <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-amber-400/60 bg-transparent px-7 text-base font-bold text-amber-400 hover:bg-amber-500 hover:text-[#001f2e]"
              >
                <Link href="/#contact">
                  <UserPlus className="mr-1 size-4" /> Join our team
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Photo viewer popup */}
      <Dialog open={!!photo} onOpenChange={(o) => !o && setPhoto(null)}>
        <DialogContent className="max-w-2xl overflow-hidden border-0 p-0 sm:rounded-3xl">
          {photo && (
            <div className="relative">
              <img
                src={photo.image}
                alt={photo.name}
                className="aspect-square w-full bg-black object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 pt-16">
                <DialogHeader>
                  <DialogTitle className="text-left text-2xl font-bold text-white">
                    {photo.name}
                  </DialogTitle>
                  <DialogDescription className="text-left text-base text-amber-400">
                    {photo.role}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-3 flex flex-wrap gap-2">
                  {photo.socials.map((s) => {
                    const Icon = socialIcon[s.label];
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${photo.name} on ${s.label}`}
                        className="grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-[#00394f]"
                      >
                        {typeof Icon === "function" ? (
                          <Icon className="size-4" />
                        ) : (
                          Icon
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogClose
            className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
            aria-label="Close"
          >
            <X className="size-5" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}