"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import {
  Menu,
  Sun,
  Moon,
  ChevronDown,
  CalendarDays,
  Building2,
  Home,
  Music,
  Users,
  Info,
  Phone,
  LogOut,
  UserRound,
  Settings,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { events } from "@/lib/data";

const NAV_LINKS = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Community", href: "#events", icon: Users },
];

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: session, status } = useSession();
  const authenticated = status === "authenticated" && !!session?.user;
  const initials = (session?.user?.username || session?.user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    router.replace("/");
  };

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* Decorative floating music notes */}
      <span
        aria-hidden="true"
        className="music-note-bg text-primary left-[8%] top-1 hidden lg:block"
        style={{ animationDelay: "0s" }}
      >
        ♪
      </span>
      <span
        aria-hidden="true"
        className="music-note-bg text-accent right-[14%] top-2 hidden lg:block"
        style={{ animationDelay: "1.5s" }}
      >
        ♫
      </span>
      <span
        aria-hidden="true"
        className="music-note-bg text-primary left-[40%] top-1 hidden xl:block"
        style={{ animationDelay: "3s" }}
      >
        ♬
      </span>

      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4"
        aria-label="Main navigation"
      >
        <Link
          href="#home"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Bestcoach Music home"
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}

          {/* Events dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Events
                  <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                  <CalendarDays className="size-3.5" /> Flagship Events
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {events.map((ev) => (
                  <DropdownMenuItem asChild key={ev.id}>
                    <Link href="#events" className="flex-col items-start">
                      <span className="font-medium">{ev.title}</span>
                      <span className="text-xs text-muted-foreground">
                        Code: {ev.short}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* Company dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Company
                  <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="#about" className="flex items-center gap-2">
                    <Info className="size-4" /> About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#about" className="flex items-center gap-2">
                    <Users className="size-4" /> Team
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#contact" className="flex items-center gap-2">
                    <Phone className="size-4" /> Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                  <Building2 className="size-3.5" /> A BCSE-CENTRE subsidiary
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="size-9 rounded-full"
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>

          {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden h-9 items-center gap-2 rounded-full pl-1 pr-3 ring-offset-background transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
                  aria-label="Open account menu"
                >
                  <Avatar className="h-7 w-7">
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.username || "user"}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-[#00394f] text-xs font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="max-w-[120px] truncate text-sm font-medium text-foreground/90">
                    {session?.user?.username || "Account"}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {session?.user?.username || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session?.user?.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <UserRound className="size-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="size-4" /> Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden h-9 sm:inline-flex"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="hidden h-9 bg-accent text-accent-foreground hover:bg-accent/85 sm:inline-flex"
              >
                <Link href="/signup">
                  <Music className="size-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden size-9"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:max-w-[340px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                <SheetClose asChild>
                  <Link
                    href="#home"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/30"
                  >
                    <Home className="size-4" /> Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#events"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/30"
                  >
                    <Users className="size-4" /> Community
                  </Link>
                </SheetClose>

                <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Events
                </p>
                {events.map((ev) => (
                  <SheetClose asChild key={ev.id}>
                    <Link
                      href="#events"
                      className="flex flex-col rounded-md px-3 py-2 text-sm hover:bg-accent/30"
                    >
                      <span className="font-medium">{ev.title}</span>
                      <span className="text-xs text-muted-foreground">
                        Code: {ev.short}
                      </span>
                    </Link>
                  </SheetClose>
                ))}

                <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Company
                </p>
                <SheetClose asChild>
                  <Link
                    href="#about"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                    <Info className="size-4" /> About Us
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#about"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                    <Users className="size-4" /> Team
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#contact"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                    <Phone className="size-4" /> Contact
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                {authenticated ? (
                  <>
                    <div className="mb-2 flex items-center gap-3 rounded-lg bg-accent/20 p-3">
                      <Avatar className="h-10 w-10">
                        {session?.user?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={session.user.image}
                            alt={session.user.username || "user"}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-[#00394f] text-sm font-bold text-white">
                            {initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {session?.user?.username || "User"}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {session?.user?.email}
                        </div>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="h-11 w-full">
                        <Link href="/profile">
                          <UserRound className="size-4" /> My Profile
                        </Link>
                      </Button>
                    </SheetClose>
                    <Button
                      onClick={handleSignOut}
                      className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
                    >
                      <LogOut className="size-4" /> Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="h-11 w-full">
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/85"
                    >
                      <Link href="/signup">
                        <Music className="size-4" /> Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}