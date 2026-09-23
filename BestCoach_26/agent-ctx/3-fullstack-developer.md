# Task 3 — Fullstack-Developer — Bestcoach Music Frontend

Task: Build the complete Bestcoach Music single-page frontend on Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui.

## What was built

All components live under `src/components/bestcoach/`:

| File | Purpose |
| --- | --- |
| `logo.tsx` | Brand logo with `/bestcoach-logo.png` if present, otherwise inline Music-icon fallback. |
| `topbar.tsx` | Slim teal top bar with phone/email/hours + socials (WhatsApp, Facebook, TikTok, Instagram). Hidden on mobile, fades out once the user scrolls. |
| `navbar.tsx` | Sticky navbar with logo, smooth-scroll links (Home, Community), Events + Company dropdowns, dark/light toggle (next-themes), Sign In / Sign Up buttons. Mobile uses shadcn Sheet. Scroll-shadow when scrolled. Decorative music notes. |
| `hero.tsx` | #home hero — badge, big H1, intro, "Follow Us For More" CTA (linktree) + image card with fallback. Framer-motion fade/slide. Teal-tinted gradient bg + floating notes. |
| `programs.tsx` | #programs — 3-package grid with featured "Most Popular" highlight. Each card opens an Enroll Dialog posting to `POST /api/enrollments { name, email, package, price }`. Loading + toast + reset on success. |
| `services.tsx` | #services — 13-service grid (2/3/4 cols) with amber-icon circles, hover lift, CTA "Make a special request" → #contact. |
| `about.tsx` | #about — sub-banner, mission, history timeline cards, founder story (image + text), 6 community metrics as glass cards. Staggered framer-motion fade-ins. |
| `events.tsx` | #events — TSS + TMME as alternating image/text rows with short-code badge + Register/Learn More CTAs. |
| `loyalty.tsx` | #loyalty — Teal gradient feature band with TLP badge, paragraph, "Join the Loyalty Project" CTA → #contact + floating notes. |
| `register.tsx` | #register — Two-column: checklist + Enroll Now (linktree form), and a glass "Special Request" card with Name/Email/Select(service) posting to `POST /api/special-requests { name, email, service }`. Loading + toast + reset. |
| `contact.tsx` | #contact — Searchable FAQ accordion, contact form (Name/Email/Subject/Message/hasAccount Select) posting to `POST /api/contacts`, urgent-contact grid (Call/WhatsApp/Telegram/Email/Hours/Map Dialog with iframe embed), back-to-top. |
| `footer.tsx` | role="contentinfo" footer with `mt-auto`. 4 cols: brand + socials, contact details, quick links, newsletter form posting to `POST /api/newsletter`. Bottom bar with copyright year. |
| `ai-agent.tsx` | Floating bottom-right circular button with Mic2/X icon swap, opening a Popover with a friendly greeting + quick-link buttons (Find a program → #programs, Contact us → #contact, Book a lesson → enrollForm). |

## Page composition

`src/app/page.tsx` is a `"use client"` component that composes everything inside `<div className="flex min-h-screen flex-col">`:

```
<TopBar />
<Navbar />
<main className="flex-1">
  <Hero /> <Programs /> <Services /> <About />
  <Events /> <Loyalty /> <Register /> <Contact />
</main>
<Footer />
<AIAgent />
```

This satisfies the sticky-footer requirement (footer uses `mt-auto`) and the single-route constraint (only `/` exists, all sections are smooth-scroll anchors).

## Forms / API contract compliance

All four API endpoints wired exactly per Task 4's contract:

- `POST /api/enrollments` — Programs' Enroll dialog (name, email, package, price)
- `POST /api/special-requests` — Register's Special Request form (name, email, service)
- `POST /api/contacts` — Contact form (name, email, subject, message, hasAccount boolean)
- `POST /api/newsletter` — Footer newsletter (name, email)

Every form: disabled submit + spinner text while loading, success/error toast using `useToast` from `@/hooks/use-toast` (already wired in layout via `<Toaster />`), and full reset on success.

## Fallbacks / dev notes

- Logo, hero, program, event and about images all have onError fallbacks (bestcoach-logo.png → Music-icon; bestcoach-hero.jpg → packages[1].img; program img → /logo.svg; event img → packages[2].img; about.jpg → community image). No broken-image ever shown.
- next-themes "mounted" pattern uses `requestAnimationFrame(() => setMounted(true))` so the React 19 / next plugin lint rule `react-hooks/set-state-in-effect` doesn't fire.
- Lint result: `bun run lint` → **0 errors, 0 warnings**.
- Dev server log: HTTP 200 on `/`, multiple successful compiles after editing.
