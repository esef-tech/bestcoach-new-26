"use client";

import React, { useEffect, useRef, useState } from "react";
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
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendEmailVerification,
  RecaptchaVerifier,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  type PhoneMultiFactorInfo,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 23 23" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

/* ---------- Helper: custom recaptcha container typed safely ---------- */
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // MFA states
  const [mfaResolver, setMfaResolver] = useState<ReturnType<
    typeof getMultiFactorResolver
  > | null>(null);
  const [mfaPhone, setMfaPhone] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Set up invisible reCAPTCHA when MFA is required
  useEffect(() => {
    if (mfaResolver && typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" },
      );
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, [mfaResolver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMfaResolver(null);
    setMfaPhone("");
    setMfaCode("");
    setMfaError("");
    setVerificationId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseConfigured) {
      setError("Firebase authentication is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: new Date(),
          role: "user",
        });
      }

      toast.success("Signed in successfully!");
      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/multi-factor-auth-required") {
        const resolver = getMultiFactorResolver(
          auth,
          err as Parameters<typeof getMultiFactorResolver>[1]
        );
        const phoneHint = resolver.hints.find(
          (hint): hint is PhoneMultiFactorInfo =>
            hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID
        );

        if (!phoneHint) {
          setError("This account requires an unsupported MFA method.");
          return;
        }

        setMfaResolver(resolver);
        setMfaPhone(phoneHint.phoneNumber || "");
        toast.info("2FA required — enter the code sent to your phone.");

        const phoneInfoOptions = {
          multiFactorHint: phoneHint,
          session: resolver.session,
        };
        const appVerifier =
          window.recaptchaVerifier ??
          new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });
        window.recaptchaVerifier = appVerifier;

        new PhoneAuthProvider(auth).verifyPhoneNumber(
          phoneInfoOptions,
          appVerifier
        )
          .then((vid) => setVerificationId(vid))
          .catch((mfaErr: Error) => setMfaError(mfaErr.message));
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaLoading(true);
    setMfaError("");

    try {
      const cred = PhoneAuthProvider.credential(verificationId, mfaCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await mfaResolver!.resolveSignIn(multiFactorAssertion);
      toast.success("MFA verification successful!");
      router.push("/");
    } catch (err) {
      setMfaError((err as Error).message);
    } finally {
      setMfaLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!firebaseConfigured) {
      setError("Firebase authentication is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Microsoft — stable popup flow
  const handleMicrosoft = async () => {
    if (!firebaseConfigured) {
      setError("Firebase authentication is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local.");
      return;
    }
    const provider = new OAuthProvider("microsoft.com");
    provider.setCustomParameters({
      prompt: "select_account",
      tenant: "common",
    });

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email && !user.emailVerified) {
        await sendEmailVerification(user);
        toast.info("Verification email sent. Please check your inbox.");
      } else {
        toast.success("Signed in with Microsoft successfully!");
      }
      router.push("/");
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-closed-by-user") {
        toast.info("Login cancelled.");
      } else {
        setError(
          (err as Error).message || "Microsoft login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 6-digit code inputs
  const handleCodeChange = (idx: number, raw: string) => {
    const nextValue = raw.replace(/[^0-9]/g, "");
    const codeArr = mfaCode.split("");
    codeArr[idx] = nextValue;
    setMfaCode(codeArr.join("").slice(0, 6));
    if (nextValue && idx < 5) {
      document.getElementById(`code-input-${idx + 1}`)?.focus();
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
            Sign In
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!mfaResolver ? (
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
          ) : (
            <div className="mb-4 rounded-3xl border-0 bg-[#f5f5fa]/95 p-6 shadow-sm">
              <div className="mb-4 text-center">
                <span className="text-4xl">🔒</span>
                <h5 className="mt-2 mb-1 font-semibold text-[#00394f]">
                  Two-Factor Authentication
                </h5>
                <div className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to
                </div>
                <div className="mb-3 font-medium">{mfaPhone}</div>
              </div>
              <form onSubmit={handleMfaSubmit}>
                <div className="mb-4 flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`code-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      autoFocus={idx === 0}
                      value={mfaCode[idx] || ""}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      className="h-12 w-10 rounded-xl border border-border bg-white/80 text-center text-2xl shadow-sm outline-none transition focus:ring-2 focus:ring-ring"
                    />
                  ))}
                </div>
                <Button
                  type="submit"
                  disabled={mfaLoading || mfaCode.length !== 6}
                  className="h-11 w-full rounded-full bg-[#00394f] font-semibold text-white hover:bg-[#00293a] disabled:opacity-60"
                >
                  {mfaLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
                {mfaError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{mfaError}</AlertDescription>
                  </Alert>
                )}
              </form>
            </div>
          )}

          <div className="mb-6 mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-amber-500 hover:text-amber-600"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            variant="secondary"
            className="mb-3 h-14 w-full gap-3 rounded-full bg-[#00394f] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#00293a]"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <Button
            type="button"
            onClick={handleMicrosoft}
            variant="secondary"
            className="mb-6 h-14 w-full gap-3 rounded-full bg-[#00394f] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#00293a]"
          >
            <MicrosoftIcon />
            Continue with Microsoft
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-amber-500 hover:text-amber-600"
            >
              Sign up here
            </Link>
          </p>

          {/* invisible reCAPTCHA mount point */}
          <div id="recaptcha-container" ref={recaptchaRef} />
        </CardContent>
      </Card>
    </section>
  );
}