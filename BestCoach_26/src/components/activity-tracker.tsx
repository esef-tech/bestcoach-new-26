"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function ActivityTracker() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const lastRecorded = useRef("");

  useEffect(() => {
    const userId = session?.user?.id;
    if (status !== "authenticated" || !userId || !pathname) return;

    const visitKey = `${userId}:${pathname}`;
    if (lastRecorded.current === visitKey) return;
    lastRecorded.current = visitKey;

    void fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch((error) => console.error("[activity] Could not record page view:", error));
  }, [pathname, session?.user?.id, status]);

  return null;
}