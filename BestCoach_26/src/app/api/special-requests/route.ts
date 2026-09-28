import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUserNotification } from "@/lib/user-notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const service = String(body.service ?? "").trim();

    if (!name || !email || !service) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
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

    const request = await db.specialRequest.create({
      data: { name, email, service },
    });

    const session = await getServerSession(authOptions);
    await createUserNotification({
      userId: session?.user?.id,
      eventKey: `special-request:${request.id}`,
      type: "special-request",
      title: "Special request received",
      message: `Your request about ${service} was sent successfully.`,
      href: "/profile#notifications",
    });

    return NextResponse.json({
      success: true,
      message: "Request sent successfully! 🎉",
    });
  } catch (err) {
    console.error("[special-requests] error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
