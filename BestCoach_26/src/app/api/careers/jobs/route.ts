import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const jobs = await db.job.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ ok: true, jobs });
  } catch (err) {
    console.error("[careers/jobs] error:", err);
    return NextResponse.json(
      { ok: false, message: "Could not load open positions." },
      { status: 500 }
    );
  }
}