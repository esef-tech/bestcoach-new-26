"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { auth, firebaseConfigured } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

/* ---------- Brand logo (local, optimized via next/image) ---------- */
function BestcoachLogo() {
  return (
    <Image
      src="/bc-logo.jpeg"
      alt="BestCoach"
      width={60}
      height={60}
      priority
      className="mx-auto mb-4 block object-contain"
    />
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M21.35 12.23c0-.73-.07-1.44-.2-2.12H12v4.01h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.28Z" />
      <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z" />
      <path fill="#FBBC05" d="M6.54 13.68a5.84 5.84 0 0 1 0-3.36V7.79H3.3a9.6 9.6 0 0 0 0 8.42l3.24-2.53Z" />
      <path fill="#EA4335" d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.38 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.01 9.46 6.29 12 6.29Z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "microsoft" | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      toast.error("Sign-in failed. Check your credentials.");
      return;
    }
    toast.success("Signed in successfully!");
    router.push("/");
    router.refresh();
  };

  const handleSocialSignIn = async (provider: "google" | "microsoft") => {
    if (!firebaseConfigured || !auth) {
      setError("Firebase authentication is not configured.");
      return;
    }

    setSocialLoading(provider);
    setError("");
    try {
      const authProvider = provider === "google"
        ? new GoogleAuthProvider()
        : new OAuthProvider("microsoft.com");
      const result = await signInWithPopup(auth, authProvider);
      const idToken = await result.user.getIdToken();
      const response = await signIn("firebase", { idToken, redirect: false });

      if (response?.error) {
        throw new Error("Could not create the Bestcoach session.");
      }
      toast.success("Signed in successfully!");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      const errorCode = err && typeof err === "object" && "code" in err
        ? String(err.code)
        : "";
      const message = errorCode === "auth/unauthorized-domain"
        ? `This site (${window.location.hostname}) is not authorized for Firebase sign-in. Add it in Firebase Console > Authentication > Settings > Authorized domains.`
        : "Social sign-in failed. Please try again.";
      setError(message);
      toast.error(errorCode === "auth/unauthorized-domain"
        ? "Add this site to Firebase Authorized domains."
        : "Social sign-in failed.");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e] px-4 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-10 text-white"
        aria-hidden="true"
      >
        <span className="absolute left-[8%] top-[18%] text-4xl">♪</span>
        <span className="absolute right-[12%] top-[28%] text-5xl">♫</span>
        <span className="absolute left-[20%] bottom-[16%] text-3xl">♬</span>
        <span className="absolute right-[22%] bottom-[22%] text-4xl">♪</span>
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-0 bg-white/92 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-2">
        <CardContent className="p-8">
          <BestcoachLogo />
          <h2 className="mb-6 text-center text-2xl font-bold text-[#00394f]">
            Sign In
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base text-[#00394f]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base text-[#00394f]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white transition-transform duration-300 hover:scale-[1.03] hover:bg-[#00293a] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>Or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading || socialLoading !== null}
              className="h-11 gap-2 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              {socialLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("microsoft")}
              disabled={loading || socialLoading !== null}
              className="h-11 gap-2 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              {socialLoading === "microsoft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MicrosoftIcon />}
              Microsoft
            </Button>
          </div>

          <div className="mb-6 mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-amber-500 hover:text-amber-600"
            >
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-amber-500 hover:text-amber-600"
            >
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}