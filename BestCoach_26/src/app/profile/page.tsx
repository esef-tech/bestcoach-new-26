"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload, X, RefreshCw, ShoppingBag, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserNotifications } from "@/components/notification-provider";
import { refreshUserNotifications } from "@/lib/notification-events";

/* Resize an uploaded image to a square data URL (cover-crop, JPEG q85). */
function fileToResizedDataUrl(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

type ProfileResponse = {
  ok?: boolean;
  message?: string;
  user?: { username?: string; image?: string | null };
  orders?: OrderSummary[];
  metrics?: ProfileMetrics;
  topPages?: { path: string; views: number }[];
};

type OrderSummary = {
  id: string;
  reference: string;
  currency: string;
  totalGhs: number;
  totalUsd: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
  itemCount: number;
  items: { name: string; quantity: number }[];
};

type ProfileMetrics = {
  ordersPlaced: number;
  paidOrders: number;
  pendingOrders: number;
  totalSpentGhs: number;
  totalSpentUsd: number;
  pageViews: number;
  uniquePages: number;
  lastActiveAt: string | null;
};

async function readProfileResponse(response: Response): Promise<ProfileResponse> {
  const text = await response.text();
  if (!text.trim()) {
    return { ok: false, message: "The server returned an empty response." };
  }

  try {
    return JSON.parse(text) as ProfileResponse;
  } catch {
    return { ok: false, message: "The server returned an invalid response." };
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const {
    notifications,
    unreadCount,
    hasMore: hasMoreNotifications,
    loadMoreNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useUserNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [metrics, setMetrics] = useState<ProfileMetrics | null>(null);
  const [topPages, setTopPages] = useState<{ path: string; views: number }[]>([]);
  const [verifyingReference, setVerifyingReference] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await readProfileResponse(res);
        if (!active) return;
        if (data.ok && data.user) {
          setUsername(data.user.username ?? "");
          setImage(data.user.image ?? null);
          setOrders(data.orders ?? []);
          setMetrics(data.metrics ?? null);
          setTopPages(data.topPages ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [status]);

  const verifyPurchase = async (reference: string) => {
    setVerifyingReference(reference);
    try {
      const response = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
        { cache: "no-store" }
      );
      const result = (await response.json()) as { ok?: boolean; status?: string; message?: string };
      if (!response.ok || !result.ok) {
        toast.error(result.message || "Could not verify this purchase.");
        return;
      }

      if (result.status === "paid") {
        toast.success("Payment verified.");
        refreshUserNotifications();
      }
      else if (result.status === "failed" || result.status === "abandoned") {
        toast.error(`Payment ${result.status}.`);
      } else toast.info("Payment is still pending.");

      const profileResponse = await fetch("/api/profile", { cache: "no-store" });
      const profile = await readProfileResponse(profileResponse);
      if (profile.ok) {
        setOrders(profile.orders ?? []);
        setMetrics(profile.metrics ?? null);
        setTopPages(profile.topPages ?? []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not verify this purchase.");
    } finally {
      setVerifyingReference(null);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    try {
      const dataUrl = await fileToResizedDataUrl(file, 256);
      setImage(dataUrl);
      toast.success("Picture ready — click Save to apply.");
    } catch (err) {
      console.error(err);
      toast.error("Could not process that image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, image: image ?? "" }),
      });
      const data = await readProfileResponse(res);
      if (!res.ok || !data.ok) {
        toast.error(data.message || "Could not save profile.");
        return;
      }
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: { username: data.user?.username ?? username, image: data.user?.image ?? null },
        })
      );
      // Refresh the session so the navbar avatar/username updates live
      await update({});
      toast.success("Profile updated! 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (username || session?.user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <section className="relative flex min-h-screen items-start justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e] px-4 py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-10 text-white"
        aria-hidden="true"
      >
        <span className="absolute left-[8%] top-[18%] text-4xl">♪</span>
        <span className="absolute right-[12%] top-[28%] text-5xl">♫</span>
        <span className="absolute left-[20%] bottom-[16%] text-3xl">♬</span>
      </div>

      <div className="relative z-10 grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      <Card className="w-full max-w-md justify-self-center overflow-hidden rounded-3xl border-0 bg-white/92 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#00394f]">
            Your Profile
          </h2>

          {/* Avatar with upload */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[#00394f] text-2xl font-bold text-white">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-md transition hover:bg-amber-600"
                aria-label="Upload profile picture"
              >
                <Upload className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500"
              >
                <X className="h-3 w-3" /> Remove picture
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg font-bold text-[#00394f]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={40}
                className="text-lg font-bold text-[#00394f]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-bold text-[#00394f]">Email</Label>
              <Input
                type="email"
                value={session.user?.email ?? ""}
                disabled
                className="bg-muted/50 text-lg font-bold text-[#00394f] opacity-100"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="mt-2 h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white transition-transform duration-300 hover:scale-[1.03] hover:bg-[#00293a] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <section className="rounded-2xl border border-white/15 bg-white/95 p-5 shadow-xl md:p-6" aria-labelledby="activity-heading">
          <div className="mb-5 flex items-center gap-3">
            <Activity className="size-5 text-[#087e8b]" />
            <div>
              <h2 id="activity-heading" className="text-lg font-bold text-[#00394f]">Shopping and app activity</h2>
              <p className="text-sm text-muted-foreground">Your purchases and authenticated page visits.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-medium text-muted-foreground">Orders placed</p>
              <p className="mt-1 text-2xl font-bold text-[#00394f]">{metrics?.ordersPlaced ?? 0}</p>
              <p className="text-xs text-muted-foreground">{metrics?.paidOrders ?? 0} paid</p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-medium text-muted-foreground">Total spent</p>
              <p className="mt-1 text-base font-bold text-[#00394f]">GH₵{(metrics?.totalSpentGhs ?? 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">${(metrics?.totalSpentUsd ?? 0).toFixed(2)} USD</p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-medium text-muted-foreground">Page views</p>
              <p className="mt-1 text-2xl font-bold text-[#00394f]">{metrics?.pageViews ?? 0}</p>
              <p className="text-xs text-muted-foreground">{metrics?.uniquePages ?? 0} pages visited</p>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs font-medium text-muted-foreground">Last active</p>
              <p className="mt-1 text-sm font-bold text-[#00394f]">
                {metrics?.lastActiveAt ? new Date(metrics.lastActiveAt).toLocaleDateString() : "No visits yet"}
              </p>
              <p className="text-xs text-muted-foreground">While signed in</p>
            </div>
          </div>

          {topPages.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-[#00394f]">Most visited</h3>
              <ul className="divide-y rounded-xl border">
                {topPages.map((page) => (
                  <li key={page.path} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span className="truncate">{page.path === "/" ? "Home" : page.path}</span>
                    <span className="shrink-0 text-muted-foreground">{page.views} views</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/95 p-5 shadow-xl md:p-6" aria-labelledby="orders-heading">
          <div className="mb-4 flex items-center gap-3">
            <ShoppingBag className="size-5 text-[#087e8b]" />
            <div>
              <h2 id="orders-heading" className="text-lg font-bold text-[#00394f]">Purchase history</h2>
              <p className="text-sm text-muted-foreground">Review order and payment status.</p>
            </div>
          </div>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">Your purchases will appear here.</p>
              <Button asChild variant="outline" className="mt-3">
                <Link href="/shop">Browse shop</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {orders.map((order) => {
                const paid = order.status.toLowerCase() === "paid";
                const failed = ["failed", "abandoned"].includes(order.status.toLowerCase());
                const amount = order.currency === "USD"
                  ? `$${order.totalUsd.toFixed(2)} USD`
                  : `GH₵${order.totalGhs.toFixed(2)}`;
                return (
                  <li key={order.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#00394f]">{amount}</p>
                        <p className="mt-0.5 break-all text-xs text-muted-foreground">Ref: {order.reference}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()} · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        paid ? "bg-emerald-100 text-emerald-800" : failed ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    {order.items.length > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                      </p>
                    )}
                    {paid && order.paidAt && (
                      <p className="mt-2 text-xs text-emerald-800">Payment confirmed {new Date(order.paidAt).toLocaleString()}</p>
                    )}
                    {!paid && !failed && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void verifyPurchase(order.reference)}
                        disabled={verifyingReference !== null}
                        className="mt-3"
                      >
                        {verifyingReference === order.reference ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <RefreshCw className="size-4" />
                        )}
                        Verify payment
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {metrics?.pendingOrders ? (
            <p className="mt-4 text-xs text-amber-800">{metrics.pendingOrders} order(s) still awaiting payment confirmation.</p>
          ) : null}
        </section>

        <section id="notifications" className="scroll-mt-24 rounded-2xl border border-white/15 bg-white/95 p-5 shadow-xl md:p-6" aria-labelledby="notifications-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="notifications-heading" className="text-lg font-bold text-[#00394f]">Notifications</h2>
              <p className="text-sm text-muted-foreground">Your purchase, form, and subscription confirmations.</p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={() => void markAllNotificationsRead()}>
                Mark all as read ({unreadCount})
              </Button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No notifications yet. Successful purchases and submissions will appear here.
            </p>
          ) : (
            <ul className="divide-y rounded-xl border">
              {notifications.map((notification) => (
                <li key={notification.id} className={`flex items-start gap-3 px-3 py-4 ${notification.readAt ? "" : "bg-accent/20"}`}>
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.readAt ? "bg-transparent" : "bg-rose-600"}`} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={notification.href}
                      onClick={() => {
                        if (!notification.readAt) void markNotificationRead(notification.id);
                      }}
                      className="font-semibold text-[#00394f] hover:underline"
                    >
                      {notification.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                    <time className="mt-1 block text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {!notification.readAt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void markNotificationRead(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {hasMoreNotifications && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => void loadMoreNotifications()}>
                Load older notifications
              </Button>
            </div>
          )}
        </section>
      </div>
      </div>
    </section>
  );
}