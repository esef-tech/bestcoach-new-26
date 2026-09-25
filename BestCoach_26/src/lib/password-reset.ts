import { createHash, randomBytes } from "crypto";
import type { NextRequest } from "next/server";

const RESET_TOKEN_TTL_MINUTES = 30;

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createResetToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashResetToken(token),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000),
  };
}

export function getAppUrl(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto || (host?.startsWith("localhost") || host?.startsWith("127.") ? "http" : "https");

  if (host) return `${protocol}://${host}`;
  return process.env.NEXTAUTH_URL || "http://127.0.0.1:3000";
}

export async function sendPasswordResetEmail({
  email,
  username,
  resetUrl,
}: {
  email: string;
  username: string;
  resetUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[password-reset] Development reset link for ${email}: ${resetUrl}`);
      return;
    }
    throw new Error("Password reset email is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your Bestcoach Music password",
      text: `Hi ${username},\n\nUse this link to reset your Bestcoach Music password. It expires in 30 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#123947"><h2>Reset your Bestcoach Music password</h2><p>Hi ${username},</p><p>Use the button below to choose a new password. This link expires in 30 minutes.</p><p><a href="${resetUrl}" style="display:inline-block;background:#00394f;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px">Reset password</a></p><p>If you did not request this, you can ignore this email.</p></div>`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Password reset email failed: ${details}`);
  }
}