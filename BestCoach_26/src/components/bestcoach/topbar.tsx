"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import { contactInfo } from "@/lib/data";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 3c.32 2.07 1.46 3.59 3.5 4v2.3c-1.2.05-2.36-.27-3.5-.92v6.05c0 3.04-2.46 5.5-5.5 5.5s-5.5-2.46-5.5-5.5 2.46-5.5 5.5-5.5c.34 0 .67.03 1 .09v2.42a3.13 3.13 0 0 0-1-.16 3.16 3.16 0 1 0 3 3.16V3h2.5Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.04 20.15a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43-.14 0-.31-.01-.47-.01-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/**
 * Slim top bar with contact details + socials.
 * Hidden on small screens, and disappears once the user starts scrolling
 * (the sticky navbar moves up to the very top).
 */
export function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`hidden md:block bg-primary text-primary-foreground transition-all duration-300 ${
        scrolled ? "max-h-0 opacity-0 overflow-hidden" : "opacity-100"
      }`}
      aria-hidden={scrolled}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
        <div className="flex items-center gap-5">
          <a
            href={`tel:${contactInfo.phones[0]}`}
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Phone className="size-3.5" />
            <span>{contactInfo.phones[0]}</span>
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Mail className="size-3.5" />
            <span>{contactInfo.email}</span>
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <span>{contactInfo.hours}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-primary-foreground/70">Follow us</span>
          <a
            href={contactInfo.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bestcoach on WhatsApp"
            className="grid size-7 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <WhatsAppIcon className="size-3.5" />
          </a>
          <a
            href={contactInfo.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bestcoach on Facebook"
            className="grid size-7 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <Facebook className="size-3.5" />
          </a>
          <a
            href={contactInfo.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bestcoach on TikTok"
            className="grid size-7 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <TikTokIcon className="size-3.5" />
          </a>
          <a
            href={contactInfo.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bestcoach on Instagram"
            className="grid size-7 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <Instagram className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
