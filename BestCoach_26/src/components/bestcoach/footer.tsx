"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Loader2,
  Facebook,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./logo";
import { useToast } from "@/hooks/use-toast";
import { contactInfo } from "@/lib/data";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.32 2.07 1.46 3.59 3.5 4v2.3c-1.2.05-2.36-.27-3.5-.92v6.05c0 3.04-2.46 5.5-5.5 5.5s-5.5-2.46-5.5-5.5 2.46-5.5 5.5-5.5c.34 0 .67.03 1 .09v2.42a3.13 3.13 0 0 0-1-.16 3.16 3.16 0 1 0 3 3.16V3h2.5Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.04 20.15a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43-.14 0-.31-.01-.47-.01-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

const QUICK_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "Contact Us", href: "#contact" },
  { label: "FAQ's", href: "#contact" },
  { label: "Help", href: "#contact" },
  { label: "Terms of Use", href: "#home" },
  { label: "Privacy Policy", href: "#home" },
];

const SOCIALS = [
  { label: "WhatsApp", href: contactInfo.socials.whatsapp, Icon: WhatsAppIcon },
  { label: "Facebook", href: contactInfo.socials.facebook, Icon: Facebook },
  { label: "TikTok", href: contactInfo.socials.tiktok, Icon: TikTokIcon },
  { label: "Instagram", href: contactInfo.socials.instagram, Icon: Instagram },
];

export function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data?.success) {
        toast({
          title: "Subscribed! 🎉",
          description: data.message ?? "You're on the list.",
        });
        setName("");
        setEmail("");
      } else {
        toast({
          title: "Could not subscribe",
          description: data?.message ?? "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t bg-primary text-primary-foreground"
    >
      {/* Decorative floating notes */}
      <span aria-hidden="true" className="music-note-bg text-primary-foreground left-[5%] top-6 text-4xl" style={{ animationDelay: "0.3s" }}>♪</span>
      <span aria-hidden="true" className="music-note-bg text-accent right-[8%] top-12 text-3xl" style={{ animationDelay: "1.6s" }}>♫</span>
      <span aria-hidden="true" className="music-note-bg text-primary-foreground left-[45%] top-4 text-3xl" style={{ animationDelay: "2.4s" }}>♬</span>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + socials */}
        <div className="flex flex-col gap-4">
          <Logo className="[&_span]:text-primary-foreground" />
          <p className="text-sm text-primary-foreground/80">
            Follow Us! 🎶 Stay updated with the latest lessons, events and
            community stories from Bestcoach Music.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Bestcoach on ${label}`}
                className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="size-4.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Get in touch */}
        <div>
          <h3 className="mb-4 text-base font-semibold">Get In Touch</h3>
          <ul className="flex flex-col gap-3 text-sm text-primary-foreground/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{contactInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-accent" />
              <a
                href={`mailto:${contactInfo.email}`}
                className="hover:text-primary-foreground transition-colors"
              >
                {contactInfo.email}
              </a>
            </li>
            {contactInfo.phones.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-accent" />
                <a
                  href={`tel:${p}`}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {p}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-base font-semibold">Quick Links</h3>
          <ul className="grid grid-cols-1 gap-2 text-sm text-primary-foreground/85 sm:grid-cols-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-primary-foreground hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-base font-semibold">Newsletter</h3>
          <p className="mb-4 text-sm text-primary-foreground/80">
            Subscribe for lessons, news and community updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="nl-name" className="text-primary-foreground/90">
                Name
              </Label>
              <Input
                id="nl-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
                autoComplete="name"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nl-email" className="text-primary-foreground/90">
                Email
              </Label>
              <Input
                id="nl-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-1 h-11 bg-accent text-accent-foreground hover:bg-accent/85"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Subscribing…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Subscribe Now
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-primary-foreground/70">
          © {year} Bestcoach Music. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
