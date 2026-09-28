import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { createUserNotification } from "@/lib/user-notifications";

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

    let subscriptionId: string | null = null;
    let alreadySubscribed = false;
    try {
      const subscription = await db.newsletterSubscriber.create({
        data: { name, email },
      });
      subscriptionId = subscription.id;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 = unique constraint violation
        if (err.code === "P2002") {
          alreadySubscribed = true;
          const existing = await db.newsletterSubscriber.findUnique({
            where: { email },
            select: { id: true },
          });
          subscriptionId = existing?.id ?? null;
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }

    if (subscriptionId) {
      const session = await getServerSession(authOptions);
      await createUserNotification({
        userId: session?.user?.id,
        eventKey: `newsletter:${subscriptionId}`,
        type: "newsletter",
        title: "Newsletter subscription confirmed",
        message: alreadySubscribed
          ? "Your Bestcoach Music newsletter subscription is active."
          : "You subscribed to Bestcoach Music updates successfully.",
        href: "/profile#notifications",
      });
    }

    return NextResponse.json({
      success: true,
      message: alreadySubscribed
        ? "You're already subscribed! 🎶"
        : "Subscribed successfully! 🎉",
    });
  } catch (err) {
    console.error("[newsletter] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
