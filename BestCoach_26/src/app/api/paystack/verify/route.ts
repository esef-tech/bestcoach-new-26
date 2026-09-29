import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createUserNotification } from "@/lib/user-notifications";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, message: "Sign in to verify this purchase." },
        { status: 401 }
      );
    }

    const reference = req.nextUrl.searchParams.get("reference");
    if (!reference) {
      return NextResponse.json(
        { ok: false, message: "Missing reference." },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({ where: { reference } });
    if (!order) {
      return NextResponse.json(
        { ok: false, message: "Order not found." },
        { status: 404 }
      );
    }
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { ok: false, message: "You cannot verify another user's purchase." },
        { status: 403 }
      );
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { ok: false, message: "Payment verification is temporarily unavailable." },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const data = await res.json();
    const status = data?.data?.status; // "success" | "failed" | "abandoned"
    if (status === "success") {
      await db.order.update({
        where: { id: order.id },
        data: { status: "paid", paidAt: new Date() },
      });
      await createUserNotification({
        userId: session.user.id,
        eventKey: `order-paid:${order.id}`,
        type: "purchase",
        title: "Purchase successful",
        message: `Your order ${reference} was paid successfully.`,
        href: "/profile#orders-heading",
      });
      return NextResponse.json({
        ok: true,
        status: "paid",
        reference,
        currency: order.currency,
        totalGhs: order.totalGhs,
        totalUsd: order.totalUsd,
      });
    }
    if (status === "failed" || status === "abandoned") {
      await db.order.update({
        where: { id: order.id },
        data: { status: status === "failed" ? "failed" : "abandoned" },
      });
      return NextResponse.json({ ok: true, status, reference });
    }
    return NextResponse.json({ ok: true, status: "pending", reference });
  } catch (err) {
    console.error("[paystack verify] error:", err);
    return NextResponse.json(
      { ok: false, message: "Verification failed." },
      { status: 500 }
    );
  }
}