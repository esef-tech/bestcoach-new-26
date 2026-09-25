import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createResetToken,
  getAppUrl,
  sendPasswordResetEmail,
} from "@/lib/password-reset";

const genericResponse = {
  ok: true,
  message: "If an account exists for that email, a reset link has been sent.",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(genericResponse);
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json(genericResponse);

    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const resetToken = createResetToken();
    await db.passwordResetToken.create({
      data: {
        tokenHash: resetToken.tokenHash,
        expiresAt: resetToken.expiresAt,
        userId: user.id,
      },
    });

    const resetUrl = `${getAppUrl(request)}/reset-password?token=${resetToken.token}`;
    try {
      await sendPasswordResetEmail({
        email: user.email,
        username: user.username,
        resetUrl,
      });
    } catch (error) {
      await db.passwordResetToken.delete({ where: { tokenHash: resetToken.tokenHash } });
      throw error;
    }

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("[forgot-password] error:", error);
    return NextResponse.json(
      { ok: false, message: "We could not send the reset email. Please try again." },
      { status: 500 }
    );
  }
}