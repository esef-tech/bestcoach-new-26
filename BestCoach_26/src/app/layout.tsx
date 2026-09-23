//Layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";            // radix (for useToast)
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // sonner
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bestcoach Music | Online Singing Lessons & Vocal Community",
  description:
    "Join Bestcoach Music — the ultimate online music community. Real-time vocal coaching, mentorship, live webinars, instrument lessons and events. Start your musical journey today.",
  keywords: [
    "singing lessons online",
    "vocal coach",
    "music mentorship",
    "bestcoach music",
    "singer community",
    "voice training",
    "online singing classes",
    "piano lessons",
    "drum lessons",
    "Accra music school",
  ],
  authors: [{ name: "Bestcoach Music" }],
  icons: {
    icon: "https://bestcoachmusic.netlify.app/IMAGES/2025-bc-logo.jpeg",
  },
  openGraph: {
    title: "Bestcoach Music | Online Singing Lessons & Vocal Community",
    description:
      "Unlock your musical potential with Bestcoach Music — vibrant community, expert coaching and live events.",
    siteName: "Bestcoach Music",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bestcoach Music",
    description: "Online singing lessons, vocal coaching & music mentorship.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />            {/* radix — for useToast() in existing forms */}
          <SonnerToaster richColors position="top-right" />  {/* sonner — for SignIn */}
        </ThemeProvider>
      </body>
    </html>
  );
}