import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "Anonymous").trim() || "Anonymous";
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    try {
      await db.newsletterSubscriber.create({
        data: { name, email },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 = unique constraint violation
        if (err.code === "P2002") {
          return NextResponse.json({
            success: true,
            message: "You're already subscribed! 🎶",
          });
        }
      }
      throw err;
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully! 🎉",
    });
  } catch (err) {
    console.error("[newsletter] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
