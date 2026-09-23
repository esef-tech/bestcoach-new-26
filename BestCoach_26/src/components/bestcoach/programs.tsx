"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, Users, Clock, CalendarDays, Tag, Loader2, Send, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { packages } from "@/lib/data";
import type { Package } from "@/lib/data";

function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? "/logo.svg" : src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

function EnrollDialog({ pkg }: { pkg: Package }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          package: pkg.title,
          price: pkg.price,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        toast({
          title: "Enrollment sent! 🎉",
          description: data.message ?? "We'll be in touch shortly.",
        });
        setName("");
        setEmail("");
        setOpen(false);
      } else {
        toast({
          title: "Could not send enrollment",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/85"
          aria-label={`Enroll in ${pkg.title}`}
        >
          <GraduationCap className="size-4" /> Join Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in {pkg.title}</DialogTitle>
          <DialogDescription>
            Fill in your details and we&apos;ll reach out to complete your
            enrollment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="enroll-name">Full Name</Label>
            <Input
              id="enroll-name"
              placeholder="e.g. Ama Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="enroll-email">Email</Label>
            <Input
              id="enroll-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="enroll-price">Package Price</Label>
            <Input
              id="enroll-price"
              value={pkg.price}
              readOnly
              className="bg-muted/60 font-medium"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-11"
            >
              Cancel
            </Button>
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
                  <Send className="size-4" /> Send Enrollment Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const DETAIL_ROWS: {
  key: "age" | "price" | "duration" | "schedule";
  icon: typeof Tag;
  label: string;
}[] = [
  { key: "age", icon: Users, label: "Age range" },
  { key: "price", icon: Tag, label: "Price" },
  { key: "duration", icon: Clock, label: "Duration" },
  { key: "schedule", icon: CalendarDays, label: "Schedule" },
];

export function Programs() {
  return (
    <section
      id="programs"
      className="section-pad bg-background"
      aria-labelledby="programs-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="size-3" /> Bestcoach Music
          </Badge>
          <h2
            id="programs-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Bestcoach For Everyone
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick the package that matches your goals and your schedule — every
            package is open to all ages and skill levels.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card
                className={`group relative h-full overflow-hidden pt-0 gap-4 transition-shadow hover:shadow-xl ${
                  pkg.featured ? "ring-2 ring-accent" : ""
                }`}
              >
                <div className="relative">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-muted">
                    <SafeImage
                      src={pkg.img}
                      alt={pkg.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {pkg.featured && (
                    <Badge className="absolute right-3 top-3 gap-1 bg-accent text-accent-foreground shadow-md">
                      <Star className="size-3" /> Most Popular
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-foreground">
                    {pkg.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {pkg.desc}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-muted/50 p-3 text-sm">
                    {DETAIL_ROWS.map(({ key, icon: Icon, label }) => (
                      <div key={label} className="flex flex-col gap-0.5">
                        <dt className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon className="size-3.5" /> {label}
                        </dt>
                        <dd className="font-medium text-foreground">
                          {pkg[key]}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <EnrollDialog pkg={pkg} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
