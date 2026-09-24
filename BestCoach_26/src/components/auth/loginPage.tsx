"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
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