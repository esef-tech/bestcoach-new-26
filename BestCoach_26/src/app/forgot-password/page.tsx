"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || "Could not send the reset email.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not send the reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e] px-4 py-24">
      <Card className="relative z-10 w-full max-w-md rounded-3xl border-0 bg-white/95 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-8">
          <Image
            src="/bc-logo.jpeg"
            alt="BestCoach"
            width={60}
            height={60}
            priority
            className="mx-auto mb-4 block object-contain"
          />
          <h1 className="mb-2 text-center text-2xl font-bold text-[#00394f]">
            Forgot password?
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Enter your email and we will send you a secure reset link.
          </p>

          {sent ? (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
              <MailCheck className="h-4 w-4" />
              <AlertDescription>
                If an account exists for that email, a reset link has been sent.
                Check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-base font-bold text-[#00394f]">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white hover:bg-[#00293a]"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
              </Button>
            </form>
          )}

          <Link
            href="/signin"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}