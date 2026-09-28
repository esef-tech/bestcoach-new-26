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
    const userId = session.user.id;
    const [user, orders, orderCount, paidOrders, pendingOrders, pageViews, topPages, latestActivity] =
      await Promise.all([
        db.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, username: true, image: true, createdAt: true },
        }),
        db.order.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            reference: true,
            currency: true,
            totalGhs: true,
            totalUsd: true,
            items: true,
            status: true,
            paidAt: true,
            createdAt: true,
          },
        }),
        db.order.count({ where: { userId } }),
        db.order.aggregate({
          where: { userId, status: "paid" },
          _count: { _all: true },
          _sum: { totalGhs: true, totalUsd: true },
        }),
        db.order.count({ where: { userId, status: "pending" } }),
        db.userActivity.count({ where: { userId } }),
        db.userActivity.groupBy({
          by: ["path"],
          where: { userId },
          _count: { _all: true },
          orderBy: { _count: { path: "desc" } },
        }),
        db.userActivity.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        }),
      ]);
    if (!user) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    const orderSummaries = orders.map((order) => {
      let items: { name: string; quantity: number }[] = [];
      try {
        const parsed: unknown = JSON.parse(order.items);
        if (Array.isArray(parsed)) {
          items = parsed.flatMap((item) => {
            if (!item || typeof item !== "object") return [];
            const record = item as { name?: unknown; quantity?: unknown };
            if (typeof record.name !== "string") return [];
            return [{
              name: record.name,
              quantity: typeof record.quantity === "number" ? record.quantity : 1,
            }];
          });
        }
      } catch {
        // Keep the order visible even if a legacy item payload is malformed.
      }

      return {
        id: order.id,
        reference: order.reference,
        currency: order.currency,
        totalGhs: order.totalGhs,
        totalUsd: order.totalUsd,
        status: order.status,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        items,
      };
    });

    return NextResponse.json({
      ok: true,
      user,
      orders: orderSummaries,
      metrics: {
        ordersPlaced: orderCount,
        paidOrders: paidOrders._count._all,
        pendingOrders,
        totalSpentGhs: paidOrders._sum.totalGhs ?? 0,
        totalSpentUsd: paidOrders._sum.totalUsd ?? 0,
        pageViews,
        uniquePages: topPages.length,
        lastActiveAt: latestActivity?.createdAt ?? null,
      },
      topPages: topPages.slice(0, 5).map((page) => ({
        path: page.path,
        views: page._count._all,
      })),
    });
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