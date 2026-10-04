import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Prisma / Neon Postgres — the source of truth for job applications.
// The Firestore mirror happens on the CLIENT (src/app/careers/page.tsx) using
// the project's existing firebase.ts `db` export, so this route stays
// backend-only and doesn't touch Firebase server-side.

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, message: "Sign in or create an account before applying." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const position = String(body.position ?? "").trim();
    const portfolio = String(body.portfolio ?? "").trim() || null;
    const message = String(body.message ?? "").trim();
    const resumeUrl = String(body.resumeUrl ?? "").trim() || null;
    const jobId = body.jobId ? String(body.jobId) : null;

    if (!name || !email || !phone || !position || !message) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please fill in name, email, phone, position and a short message.",
        },
        { status: 400 }
      );
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const application = await db.jobApplication.create({
      data: {
        jobId,
        name,
        email,
        phone,
        position,
        portfolio,
        message,
        resumeUrl,
        status: "submitted",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Application received! We'll be in touch soon. 🎉",
      applicationId: application.id,
      // echo back the saved fields so the client can mirror them to Firestore
      record: {
        applicationId: application.id,
        jobId,
        name,
        email,
        phone,
        position,
        portfolio,
        message,
        resumeUrl,
        status: "submitted",
      },
    });
  } catch (err) {
    console.error("[careers/apply] error:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}