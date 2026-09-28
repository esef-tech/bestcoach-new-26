import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error("[products] error:", err);
    return NextResponse.json(
      { ok: false, message: "Could not load products." },
      { status: 500 }
    );
  }
}