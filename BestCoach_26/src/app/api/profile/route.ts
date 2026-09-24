import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, username: true, image: true },
    });
    if (!user) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("[profile] GET error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not load your profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data: { username?: string; image?: string | null } = {};

    if (typeof body.username === "string") {
      const name = body.username.trim();
      if (!name) {
        return NextResponse.json(
          { ok: false, message: "Username cannot be empty." },
          { status: 400 }
        );
      }
      data.username = name.slice(0, 40);
    }

    if (typeof body.image === "string") {
      if (body.image === "") {
        data.image = null;
      } else if (body.image.startsWith("data:image/")) {
        if (body.image.length > 200_000) {
          return NextResponse.json(
            { ok: false, message: "Image is too large (max ~150KB after resize)." },
            { status: 413 }
          );
        }
        data.image = body.image;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { ok: false, message: "Nothing to update." },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, email: true, username: true, image: true },
    });

    return NextResponse.json({
      ok: true,
      user: updated,
      message: "Profile updated successfully! 🎉",
    });
  } catch (error) {
    console.error("[profile] PATCH error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not update your profile." },
      { status: 500 }
    );
  }
}