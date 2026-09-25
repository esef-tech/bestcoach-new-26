import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { hashResetToken } from "@/lib/password-reset";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const password = String(body.password ?? "");

    if (!token || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "Use a valid reset link and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const resetToken = await db.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(token) },
    });
    if (!resetToken || resetToken.expiresAt <= new Date()) {
      return NextResponse.json(
        { ok: false, message: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.$transaction([
      db.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
      db.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } }),
    ]);

    return NextResponse.json({ ok: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("[reset-password] error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not reset your password. Please request a new link." },
      { status: 500 }
    );
  }
}