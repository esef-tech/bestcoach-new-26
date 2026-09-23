"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";            // ✅ added
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { auth, db, firebaseConfigured } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/* ---------- Brand logo (local, optimized via next/image) ---------- */
function BestcoachLogo() {
  return (
    <Image
      src="/bestcoach-logo.png"
      alt="Bestcoach Music"
      width={60}
      height={60}
      priority
      className="mx-auto mb-4 block object-contain"
    />
  );
}

/* ---------- Password strength config ---------- */
type Strength = {
  level: "Weak" | "Medium" | "Strong" | "";
  barClass: string;
  textClass: string;
};

function calculateStrength(pass: string): Strength {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (!pass) return { level: "", barClass: "w-0", textClass: "" };
  if (score <= 2)
    return { level: "Weak", barClass: "w-1/4 bg-red-500", textClass: "text-red-500" };
  if (score === 3)
    return { level: "Medium", barClass: "w-3/5 bg-orange-500", textClass: "text-orange-500" };
  return { level: "Strong", barClass: "w-full bg-green-500", textClass: "text-green-600" };
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState<Strength>(calculateStrength(""));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setStrength(calculateStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseConfigured) {
      setError("Firebase authentication is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: form.email,
        createdAt: new Date(),
        role: "user",
      });
      toast.success("Account created! Welcome to Bestcoach Music 🎉");
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e] px-4 py-24">
      {/* subtle music-note background accent */}
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
            Create Account
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {/* strength meter */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.barClass}`}
                  />
                </div>
                {strength.level && (
                  <span
                    className={`min-w-[60px] text-right text-xs font-medium ${strength.textClass}`}
                  >
                    {strength.level}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Use 8+ chars with an uppercase letter, a number, and a symbol.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
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
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-amber-500 hover:text-amber-600"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing you agree to Bestcoach Music&apos;s{" "}
            <Link
              href="/terms"
              className="font-medium text-amber-500 hover:text-amber-600"
            >
              Terms of use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-amber-500 hover:text-amber-600"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}