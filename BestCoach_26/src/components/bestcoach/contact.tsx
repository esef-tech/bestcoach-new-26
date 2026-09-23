"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  Search,
  MessageCircle,
  ArrowUp,
  Home,
  HelpCircle,
  LifeBuoy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { faqs, contactInfo } from "@/lib/data";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.04 20.15a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43-.14 0-.31-.01-.47-.01-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.59 18.7 20.02c-.24 1.07-.88 1.34-1.78.83l-4.93-3.63-2.38 2.29c-.26.26-.48.48-.99.48l.35-5 .01-.01 9.13-8.25c.4-.35-.09-.55-.62-.2L6.83 13.05l-4.85-1.52c-1.05-.33-1.07-1.05.22-1.55l18.97-7.31c.88-.33 1.65.2 1.36 1.92Z" />
    </svg>
  );
}

const URGENT_OPTIONS = [
  {
    label: "Call us",
    desc: contactInfo.phones[0],
    href: `tel:${contactInfo.phones[0]}`,
    icon: Phone,
    accent: "text-primary",
  },
  {
    label: "WhatsApp",
    desc: "Chat with our team",
    href: contactInfo.socials.whatsapp,
    icon: WhatsAppIcon,
    accent: "text-accent",
    external: true,
  },
  {
    label: "Telegram",
    desc: "@bestcoachmusic",
    href: contactInfo.telegram,
    icon: TelegramIcon,
    accent: "text-primary",
    external: true,
  },
  {
    label: "Email",
    desc: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    icon: Mail,
    accent: "text-accent",
  },
  {
    label: "Office Hours",
    desc: contactInfo.hours,
    href: undefined,
    icon: Clock,
    accent: "text-primary",
  },
];

export function Contact() {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hasAccount, setHasAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast({
        title: "Missing details",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          hasAccount: hasAccount === "yes",
        }),
      });
      const data = await res.json();
      if (data?.success) {
        toast({
          title: "Message sent! 🎉",
          description: data.message ?? "We'll respond as soon as possible.",
        });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setHasAccount("");
      } else {
        toast({
          title: "Could not send message",
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

  return (
    <section
      id="contact"
      className="section-pad bg-background"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            <MessageCircle className="size-3" /> Get in touch
          </Badge>
          <h2
            id="contact-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Contact Us
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Advice and answers from the Bestcoach team. Find an answer on your
            own or get in touch with our support team.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* FAQ + urgent options */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <HelpCircle className="size-5 text-accent" />
                <h3 className="text-xl font-bold text-foreground">FAQ&apos;s</h3>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search FAQs..."
                  className="h-11 pl-9"
                  aria-label="Search FAQs"
                />
              </div>
              {filteredFaqs.length === 0 ? (
                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No FAQs match your search. Try a different keyword or send us
                  a message below.
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline">
                        {f.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            {/* Urgent contact options */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <LifeBuoy className="size-5 text-accent" />
                <h3 className="text-xl font-bold text-foreground">
                  Urgent contact options
                </h3>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {URGENT_OPTIONS.map((o) => {
                  const Icon = o.icon;
                  const inner = (
                    <span className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-accent/40">
                      <Icon className={`size-6 ${o.accent}`} />
                      <span className="text-sm font-semibold text-foreground">
                        {o.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {o.desc}
                      </span>
                    </span>
                  );
                  return (
                    <li key={o.label}>
                      {o.href ? (
                        <a
                          href={o.href}
                          target={o.external ? "_blank" : undefined}
                          rel={o.external ? "noopener noreferrer" : undefined}
                          className="block"
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
                <li>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        aria-label="Open map"
                        className="block w-full"
                      >
                      <span className="flex h-full flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-accent/40">
                        <MapPin className="size-6 text-accent" />
                        <span className="text-sm font-semibold text-foreground">
                          Find us
                        </span>
                        <span className="text-xs text-muted-foreground">
                          View map
                        </span>
                      </span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Find Bestcoach Music</DialogTitle>
                        <DialogDescription>
                          {contactInfo.address}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="aspect-video w-full overflow-hidden rounded-lg border">
                        <iframe
                          title="Bestcoach Music location map"
                          src={contactInfo.mapEmbed}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          allowFullScreen
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass border-white/30">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  Send us a message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and our support team will get back to
                  you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="c-name">Name</Label>
                    <Input
                      id="c-name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-email">Email</Label>
                    <Input
                      id="c-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-subject">Subject</Label>
                    <Input
                      id="c-subject"
                      placeholder="How can we help?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-message">Message</Label>
                    <Textarea
                      id="c-message"
                      placeholder="Tell us a bit more..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-account">
                      Do you have an account with BestCoach Music?
                    </Label>
                    <Select value={hasAccount} onValueChange={setHasAccount}>
                      <SelectTrigger id="c-account" className="w-full">
                        <SelectValue placeholder="Select Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 bg-accent text-accent-foreground hover:bg-accent/85"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Back to top */}
        <div className="mt-12 flex items-center justify-center gap-4 text-sm">
          <Link
            href="#home"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
          >
            <Home className="size-4" /> Back to Home
          </Link>
          <span className="text-muted-foreground/40" aria-hidden="true">
            |
          </span>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
          >
            <ArrowUp className="size-4" /> Back to top
          </a>
        </div>
      </div>
    </section>
  );
}
