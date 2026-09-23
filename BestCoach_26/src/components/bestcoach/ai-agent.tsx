"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, X, GraduationCap, PackageSearch, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { contactInfo } from "@/lib/data";

export function AIAgent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="Open Bestcoach AI assistant"
            className="group grid size-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-xl ring-2 ring-background transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="size-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Mic2 className="size-6" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="sr-only">Bestcoach AI assistant</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={10}
          className="w-80 rounded-2xl border-accent/30 p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
              <Mic2 className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Bestcoach AI Assistant
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Hi! I&apos;m the Bestcoach AI assistant. How can I help you
                today?
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 justify-start"
              onClick={() => setOpen(false)}
            >
              <Link href="#programs">
                <PackageSearch className="size-4" /> Find a program
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 justify-start"
              onClick={() => setOpen(false)}
            >
              <Link href="#contact">
                <PhoneCall className="size-4" /> Contact us
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-10 justify-start bg-accent text-accent-foreground hover:bg-accent/85"
              onClick={() => setOpen(false)}
            >
              <Link href={contactInfo.enrollForm} target="_blank" rel="noopener noreferrer">
                <GraduationCap className="size-4" /> Book a lesson
              </Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
