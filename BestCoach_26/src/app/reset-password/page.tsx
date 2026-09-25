"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        if (data.message?.includes("invalid or has expired") || !token) {
          setShowResend(true);
        }
        setError(data.message || "Could not reset your password.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Could not reset your password. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || "Could not send a new reset link.");
        return;
      }
      setResendSent(true);
    } catch {
      setError("Could not send a new reset link. Please try again.");
    } finally {
      setResendLoading(false);
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
            Reset your password
          </h1>

          {success ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <p className="text-sm text-muted-foreground">
                Your password has been updated. You can now sign in securely.
              </p>
              <Button asChild className="h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white hover:bg-[#00293a]">
                <Link href="/signin">Continue to sign in</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-base font-bold text-[#00394f]">
                  New password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-base font-bold text-[#00394f]">
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !token}
                className="h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white hover:bg-[#00293a]"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset password"}
              </Button>
              {!token && (
                <p className="text-center text-sm text-red-600">This reset link is missing or invalid.</p>
              )}
              {showResend && !resendSent && (
                <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900">
                    This link has expired. Request a new one below.
                  </p>
                  <div className="space-y-3">
                    <Label htmlFor="resend-email" className="text-sm font-bold text-[#00394f]">
                      Email for the new link
                    </Label>
                    <Input
                      id="resend-email"
                      type="email"
                      value={resendEmail}
                      onChange={(event) => setResendEmail(event.target.value)}
                      required
                      autoComplete="email"
                    />
                    <Button
                      type="button"
                      onClick={handleResend}
                      variant="outline"
                      disabled={resendLoading}
                      className="h-10 w-full gap-2 border-[#00394f] font-bold text-[#00394f] hover:bg-white"
                    >
                      {resendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
                      Send a new reset link
                    </Button>
                  </div>
                </div>
              )}
              {resendSent && (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                  <MailCheck className="h-4 w-4" />
                  <AlertDescription>
                    If an account exists for that email, a new reset link has been sent.
                    Check your inbox and spam folder.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          )}

          {!success && (
            <Link
              href="/signin"
              className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#001f2e]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}