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
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    const hasAccount = String(body.hasAccount ?? "no").trim();

    if (!name || !email || !subject || !message) {
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

    const contactMessage = await db.contactMessage.create({
      data: { name, email, subject, message, hasAccount },
    });

    const session = await getServerSession(authOptions);
    await createUserNotification({
      userId: session?.user?.id,
      eventKey: `contact:${contactMessage.id}`,
      type: "contact",
      title: "Message sent",
      message: `Your message “${subject}” was sent successfully.`,
      href: "/profile#notifications",
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! 🎉",
    });
  } catch (err) {
    console.error("[contacts] error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
