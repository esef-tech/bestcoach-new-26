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
    const pkg = String(body.package ?? "").trim();
    const price = String(body.price ?? "").trim();

    if (!name || !email || !pkg || !price) {
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

    const enrollment = await db.enrollment.create({
      data: { name, email, package: pkg, price },
    });

    const session = await getServerSession(authOptions);
    await createUserNotification({
      userId: session?.user?.id,
      eventKey: `enrollment:${enrollment.id}`,
      type: "enrollment",
      title: "Enrollment request sent",
      message: `Your request for ${pkg} was received successfully.`,
      href: "/profile#notifications",
    });

    return NextResponse.json({
      success: true,
      message: "Enrollment request sent successfully! 🎉",
    });
  } catch (err) {
    console.error("[enrollments] error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
