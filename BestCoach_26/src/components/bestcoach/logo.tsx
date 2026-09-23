"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bestcoach brand logo.
 * Uses /bestcoach-logo.png if it exists in /public, otherwise renders an
 * inline fallback (a teal circle with a Music lucide icon) so there is
 * NEVER a broken image.
 */
export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/bestcoach-logo.png", { method: "HEAD", cache: "no-store" })
      .then((r) => active && setHasImage(r.ok && r.status !== 404))
      .catch(() => active && setHasImage(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {hasImage ? (
        <img
          src="https://bestcoachmusic.netlify.app/IMAGES/2025-bc-logo.jpeg"
          alt="Bestcoach Music logo"
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-md"
        >
          <Music className="size-5" />
        </span>
      )}
      {withText && (
        <span className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-tight text-foreground">
            Bestcoach
          </span>
          <span className="text-amber-accent text-[11px] font-semibold uppercase tracking-[0.18em]">
            Music
          </span>
        </span>
      )}
    </span>
  );
}
