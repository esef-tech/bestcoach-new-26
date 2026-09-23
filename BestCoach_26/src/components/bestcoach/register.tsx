"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Send,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { services, contactInfo } from "@/lib/data";

const CHECKLIST = [
  "Best Coach Music excels in music education. 🎵",
  "Bestcoach Music nurtures musicians. 🎵",
  "Bestcoach Music, a BCSE-CENTRE subsidiary 🎵",
];

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !service) {
      toast({
        title: "Missing details",
        description: "Please enter your name, email and select a service.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/special-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, service }),
      });
      const data = await res.json();
      if (data?.success) {
        toast({
          title: "Special request sent! 🎵",
          description: data.message ?? "We'll reach out shortly.",
        });
        setName("");
        setEmail("");
        setService("");
      } else {
        toast({
          title: "Could not send request",
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
      id="register"
      className="section-pad bg-muted/30"
      aria-labelledby="register-heading"
    >
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-2">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <Badge className="w-fit bg-primary/10 text-primary border-primary/20">
            <Sparkles className="size-3" /> Bestcoach music
          </Badge>
          <h2
            id="register-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Register Now
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Ready to take your musical journey to the next level? Register now
            and become a part of our vibrant community! Fill out the form and
            let&apos;s make some beautiful music together. 🎸🎤
          </p>
          <ul className="flex flex-col gap-2.5">
            {CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-foreground"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            asChild
            size="lg"
            className="mt-2 h-12 w-fit bg-accent text-accent-foreground hover:bg-accent/85"
          >
            <Link href={contactInfo.enrollForm} target="_blank" rel="noopener noreferrer">
              <GraduationCap className="size-5" /> Enroll Now
            </Link>
          </Button>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-white/30">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Special Request
              </CardTitle>
              <CardDescription>
                Tell us what you need — lessons, rentals, repairs, sound
                engineering or anything else. We&apos;ll get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sr-name">Full Name</Label>
                  <Input
                    id="sr-name"
                    placeholder="e.g. Kwame Owusu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sr-email">Email</Label>
                  <Input
                    id="sr-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sr-service">Course or Service Requested</Label>
                  <Select value={service} onValueChange={setService} required>
                    <SelectTrigger id="sr-service" className="w-full">
                      <SelectValue placeholder="Select Course or Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 bg-accent text-accent-foreground hover:bg-accent/85"
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
    </section>
  );
}
