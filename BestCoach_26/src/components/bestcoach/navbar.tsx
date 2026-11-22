"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import {
  Menu, Sun, Moon, ChevronDown, CalendarDays, Building2, Home, Music, Users,
  Info, Phone, LogOut, UserRound, Settings, ShoppingBag, Briefcase, Heart, Award,
  Globe, LifeBuoy, LogIn, Check, Handshake, HelpCircle, CreditCard, 
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/components/language-provider";
import { LANG_LABELS, LANG_CODES } from "@/lib/dictionaries";
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
import {CartDrawer } from "./cart-drawer";
import { NotificationBell } from "./notification-bell";
import { events } from "@/lib/data";

const TEAM_PAGE_HREF = "/team";
const NAV_LINKS: { tKey: "home" | "community" | "shop" | "team"; href: string; icon: LucideIcon }[] = [
  { tKey: "home", href: "#home", icon: Home },
  { tKey: "community", href: "#events", icon: Users },
  { tKey: "shop", href: "/shop", icon: ShoppingBag },
  { tKey: "team", href: "/team", icon: Users },
];

export function Navbar() {
  const router = useRouter();
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const [profileUsername, setProfileUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const authenticated = status === "authenticated" && !!session?.user;
  const initials = (profileUsername || session?.user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!authenticated) return;

    let active = true;
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as {
          user?: { username?: string; image?: string | null };
        };
        if (!active || !data.user) return;
        setProfileUsername(data.user.username ?? "");
        setProfileImage(data.user.image ?? null);
      } catch {
        if (active) {
          setProfileUsername(session?.user?.username ?? "");
          setProfileImage(session?.user?.image ?? null);
        }
      }
    };

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ username?: string; image?: string | null }>).detail;
      setProfileUsername(detail.username ?? "");
      setProfileImage(detail.image ?? null);
    };

    void loadProfile();
    window.addEventListener("focus", loadProfile);
    window.addEventListener("profile-updated", handleProfileUpdated);
    return () => {
      active = false;
      window.removeEventListener("focus", loadProfile);
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, [authenticated, session?.user?.image, session?.user?.username]);

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
          href="/#home"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Bestcoach Music home"
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={t.nav[l.tKey]}>
              <Link
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors"
              >
                {t.nav[l.tKey]}
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
                    <Link href="/#events" className="flex-col items-start">
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
                  <Link href="/#about" className="flex items-center gap-2">
                    <Info className="size-4" /> About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={TEAM_PAGE_HREF} className="flex items-center gap-2">
                    <Users className="size-4" /> Team
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/careers" className="flex items-center gap-2">
                    <Briefcase className="size-4" /> Careers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#contact" className="flex items-center gap-2">
                    <Phone className="size-4" /> Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                  <Building2 className="size-3.5" /> A BCSE-CENTRE subsidiary
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Heart className="size-4 text-amber-500" />
                  TLP
                  <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/loyalty" className="flex items-center gap-2">
                     <Award className="size-3.5" />  The Loyalty Project
                  </Link>
                </DropdownMenuItem>
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
          {authenticated && <NotificationBell />}
          <CartDrawer />
  {/* ===== Language dropdown (always visible) ===== */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors sm:inline-flex">
                <Globe className="size-4 text-amber-500" />
                {LANG_LABELS[lang]}
                <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                <Globe className="size-3.5" /> Language
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LANG_CODES.map((code) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLang(code)}
                  className="flex items-center justify-between"
                >
                  <span>{LANG_LABELS[code]}</span>
                  {lang === code && <Check className="size-4 text-green-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ===== Support dropdown (always visible) ===== */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/30 transition-colors sm:inline-flex">
                <LifeBuoy className="size-4 text-amber-500" />
                {t.nav.support}
                <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                <LifeBuoy className="size-3.5" /> {t.nav.support}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-2">
                  <HelpCircle className="size-4" /> {t.nav.helpCenter}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#programs" className="flex items-center gap-2">
                  <CreditCard className="size-4" /> {t.nav.subscriptionPlans}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#contact" className="flex items-center gap-2">
                  <Handshake className="size-4" /> {t.nav.partnerSolutions}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden h-9 items-center gap-2 rounded-full pl-1 pr-3 ring-offset-background transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
                  aria-label="Open account menu"
                >
                  <Avatar className="h-7 w-7">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={profileUsername || "user"}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-[#00394f] text-xs font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="max-w-[120px] truncate text-sm font-medium text-foreground/90">
                    {profileUsername || "Account"}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {profileUsername || "User"}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden h-9 items-center gap-1.5 rounded-full bg-[#00394f] px-4 text-sm font-bold text-white transition-colors hover:bg-[#00293a] sm:inline-flex">
                  <LogIn className="size-4" />
                  {t.nav.login}
                  <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                   {t.nav.loginToAccess}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/signin" className="flex items-center gap-2">
                    <Music className="size-4 text-amber-500" /> {t.nav.bestcoachPlatform}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signin" className="flex items-center gap-2">
                    <Award className="size-4 text-amber-500" /> {t.nav.tlpPlatform}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    href="/#home"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/30"
                  >
                    <Home className="size-4" /> Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#events"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/30"
                  >
                    <Users className="size-4" /> Community
                  </Link>
                </SheetClose>

                 <SheetClose asChild>
                  <Link
                    href="/shop"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/30"
                  >
                    <ShoppingBag className="size-4" /> Shop
                  </Link>
                </SheetClose>

                <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Events
                </p>
                {events.map((ev) => (
                  <SheetClose asChild key={ev.id}>
                    <Link
                      href="/#events"
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
                    href="/#about"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                    <Info className="size-4" /> About Us
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href={TEAM_PAGE_HREF}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                    <Users className="size-4" /> Team
                  </Link>
                </SheetClose>
                 <SheetClose asChild>
                  <Link href="/careers" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30">
                    <Briefcase className="size-4" /> Careers
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#contact"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                    <Phone className="size-4" /> Contact
                  </Link>
                </SheetClose>
                 <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                   <Heart className="size-4 text-amber-500" />
                  TLP
                </p>
                <SheetClose asChild>
                  <Link
                    href="/loyalty"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"
                  >
                      <Award className="size-3.5" />The Loyalty Project
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                {authenticated ? (
                  <>
                    <div className="mb-2 flex items-center gap-3 rounded-lg bg-accent/20 p-3">
                      <Avatar className="h-10 w-10">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={profileUsername || "user"}
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
                          {profileUsername || "User"}
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
                     <SheetClose asChild>
                    <Button asChild className="h-11 w-full rounded-full bg-[#00394f] text-white hover:bg-[#00293a]">
                      <Link href="/signin"><LogIn className="size-4" /> {t.nav.login}</Link>
                    </Button>
                  </SheetClose>
                  </>
                )}
                                {/* Support section */}
                <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.nav.support}</p>
                <SheetClose asChild><Link href="/help" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"><HelpCircle className="size-4" /> {t.nav.helpCenter}</Link></SheetClose>
                <SheetClose asChild><Link href="/#programs" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"><CreditCard className="size-4" /> {t.nav.subscriptionPlans}</Link></SheetClose>
                <SheetClose asChild><Link href="/#contact" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"><Handshake className="size-4" /> {t.nav.partnerSolutions}</Link></SheetClose>

                {/* Login section */}
                <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.nav.loginToAccess}</p>
                <SheetClose asChild><Link href="/signin" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"><Music className="size-4 text-amber-500" /> {t.nav.bestcoachPlatform}</Link></SheetClose>
                <SheetClose asChild><Link href="/signin" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/30"><Award className="size-4 text-amber-500" /> {t.nav.tlpPlatform}</Link></SheetClose>

                {/* Language grid */}
                <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Language</p>
                <div className="grid grid-cols-2 gap-1 px-2 py-1">
                  {LANG_CODES.map((code) => (
                    <button key={code} onClick={() => setLang(code)} className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition ${lang === code ? "bg-[#00394f] text-white" : "hover:bg-accent/30"}`}>
                      {LANG_LABELS[code]}
                      {lang === code && <Check className="size-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}