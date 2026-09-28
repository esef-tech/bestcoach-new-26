import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const requestedLimit = Number(req.nextUrl.searchParams.get("limit"));
    const take = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.floor(requestedLimit), 1), 50)
      : 20;
    const cursor = req.nextUrl.searchParams.get("cursor");

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          href: true,
          readAt: true,
          createdAt: true,
        },
      }),
      db.notification.count({ where: { userId, readAt: null } }),
    ]);

    const hasMore = notifications.length > take;
    if (hasMore) notifications.pop();

    return NextResponse.json({
      ok: true,
      notifications,
      unreadCount,
      nextCursor: hasMore ? notifications.at(-1)?.id ?? null : null,
    });
  } catch (error) {
    console.error("[notifications] GET error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not load notifications." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (body?.readAll === true) {
      await db.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: new Date() },
      });
    } else if (typeof body?.id === "string") {
      await db.notification.updateMany({
        where: { id: body.id, userId, readAt: null },
        data: { readAt: new Date() },
      });
    } else {
      return NextResponse.json(
        { ok: false, message: "A notification ID or readAll flag is required." },
        { status: 400 }
      );
    }

    const unreadCount = await db.notification.count({ where: { userId, readAt: null } });
    return NextResponse.json({ ok: true, unreadCount });
  } catch (error) {
    console.error("[notifications] PATCH error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not update notifications." },
      { status: 500 }
    );
  }
}