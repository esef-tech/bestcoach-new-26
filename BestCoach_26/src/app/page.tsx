"use client";

import { TopBar } from "@/components/bestcoach/topbar";
import { Navbar } from "@/components/bestcoach/navbar";
import { Hero } from "@/components/bestcoach/hero";
import { Programs } from "@/components/bestcoach/programs";
import { Services } from "@/components/bestcoach/services";
import { About } from "@/components/bestcoach/about";
import { Events } from "@/components/bestcoach/events";
import { Loyalty } from "@/components/bestcoach/loyalty";
import { Register } from "@/components/bestcoach/register";
import { Contact } from "@/components/bestcoach/contact";
import { Footer } from "@/components/bestcoach/footer";
import { AIAgent } from "@/components/bestcoach/ai-agent";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Programs />
        <Services />
        <About />
        <Events />
        <Loyalty />
        <Register />
        <Contact />
      </main>
      <Footer />
      <AIAgent />
    </div>
  );
}
