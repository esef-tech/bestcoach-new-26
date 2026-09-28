import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const PRIVATE_PATHS = new Set([
  "/signin",
  "/signup",
  "/login",
  "/forgot-password",
  "/reset-password",
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const path =
      body && typeof body === "object" && "path" in body && typeof body.path === "string"
        ? body.path
        : "";
    if (
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/api/") ||
      path.length > 200 ||
      PRIVATE_PATHS.has(path)
    ) {
      return NextResponse.json({ ok: false, message: "Invalid page path." }, { status: 400 });
    }

    await db.userActivity.create({
      data: { userId: session.user.id, path },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[activity] POST error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not record activity." },
      { status: 500 }
    );
  }
}