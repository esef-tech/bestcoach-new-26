import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPaystackSecretKey, isPaystackLiveMode } from "@/lib/paystack";

type LineItem = {
  id: string;
  name: string;
  priceGhs: number;
  priceUsd: number;
  quantity: number;
};

function makeReference() {
  return `bc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, message: "Sign in before placing an order." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const items: LineItem[] = Array.isArray(body.items) ? body.items : [];
    const customerName = String(body.customerName ?? "").trim();
    const customerEmail = String(body.customerEmail ?? "")
      .trim()
      .toLowerCase();
    const customerPhone = String(body.customerPhone ?? "").trim();
    const customerAddress = String(body.customerAddress ?? "").trim();
    const rawLatitude = body.customerLatitude;
    const rawLongitude = body.customerLongitude;
    const currency: "GHS" | "USD" =
      body.currency === "USD" ? "USD" : "GHS";

    if (
      (rawLatitude == null) !== (rawLongitude == null) ||
      (rawLatitude != null &&
        (typeof rawLatitude !== "number" ||
          !Number.isFinite(rawLatitude) ||
          rawLatitude < -90 ||
          rawLatitude > 90)) ||
      (rawLongitude != null &&
        (typeof rawLongitude !== "number" ||
          !Number.isFinite(rawLongitude) ||
          rawLongitude < -180 ||
          rawLongitude > 180))
    ) {
      return NextResponse.json(
        { ok: false, message: "The current location is invalid. Please capture it again." },
        { status: 400 }
      );
    }

    const customerLatitude: number | null = rawLatitude ?? null;
    const customerLongitude: number | null = rawLongitude ?? null;

    if (!items.length || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { ok: false, message: "Cart is empty or required fields missing." },
        { status: 400 }
      );
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const secret = getPaystackSecretKey();
    if (!secret) {
      return NextResponse.json(
        {
          ok: false,
          message: isPaystackLiveMode()
            ? "Live Paystack is not configured. Add PAYSTACK_LIVE_SECRET_KEY to the deployment environment and redeploy."
            : "Paystack test mode is not configured. Add PAYSTACK_API_KEY to the deployment environment.",
        },
        { status: 503 }
      );
    }

    const totalGhs = items.reduce(
      (s, i) => s + i.priceGhs * i.quantity,
      0
    );
    const totalUsd = items.reduce(
      (s, i) => s + i.priceUsd * i.quantity,
      0
    );
    const reference = makeReference();

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        reference,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerLatitude,
        customerLongitude,
        currency,
        totalGhs,
        totalUsd,
        items: JSON.stringify(items),
        status: "pending",
      },
    });

    const amount =
      currency === "GHS"
        ? Math.round(totalGhs * 100) // pesewas
        : Math.round(totalUsd * 100); // cents
    const origin =
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.headers.get("host")}`;
    const callbackUrl = `${origin}/shop?paystack=1&reference=${reference}`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail,
        amount,
        currency,
        reference,
        callback_url: callbackUrl,
        metadata: {
          orderId: order.id,
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: customerName },
            { display_name: "Phone", variable_name: "phone", value: customerPhone },
            { display_name: "Address", variable_name: "address", value: customerAddress },
          ],
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.data?.authorization_url) {
      console.error("[paystack init] failed:", data);
      return NextResponse.json(
        {
          ok: false,
          message: data?.message || "Could not start payment. Try again.",
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      mode: "paystack",
      authorizationUrl: data.data.authorization_url,
      reference,
    });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong during checkout." },
      { status: 500 }
    );
  }
}