"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";                               
import { AuthPromptDialog } from "@/components/bestcoach/auth-prompt";      
import Link from "next/link";
import { toast } from "sonner";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCart, formatPrice, cartTotals, type CartItem } from "@/lib/cart-store";
import { refreshUserNotifications } from "@/lib/notification-events";

export function CartDrawer() {
  const {
    items,
    currency,
    setCurrency,
    addItem,
    removeItem,
    setQuantity,
    clear,
    hydrated,
  } = useCart();

  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState<{ ref: string } | null>(null);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);   
  const { status } = useSession();                                
  const authenticated = status === "authenticated";  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const totals = cartTotals(items);

  const startCheckout = () => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }
     if (!authenticated) {            
      setAuthPromptOpen(true);
      return;
    }
    setCheckoutOpen(true);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in your name, email and phone.");
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            priceGhs: i.priceGhs,
            priceUsd: i.priceUsd,
            quantity: i.quantity,
          })),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerAddress: form.address,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.message || "Checkout failed.");
        return;
      }
      if (data.mode === "paystack" && data.authorizationUrl) {
        // Redirect to Paystack hosted checkout
        window.location.href = data.authorizationUrl;
        return;
      }
      // Test mode — order paid immediately
      clear();
      setCheckoutOpen(false);
      setOpen(false);
      setDone({ ref: data.reference });
      toast.success("Payment successful! 🎉");
      refreshUserNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 rounded-full"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5" />
            {hydrated && totals.count > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1 bg-accent text-accent-foreground">
                {totals.count}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" /> Your Cart
              <span className="text-sm font-normal text-muted-foreground">
                ({hydrated ? totals.count : 0})
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Currency toggle */}
          <div className="flex items-center justify-center gap-1 rounded-full bg-muted p-1 text-sm">
            {(["GHS", "USD"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                  currency === c
                    ? "bg-[#00394f] text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "GHS" ? "GH₵ GHS" : "$ USD"}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="scroll-area-custom flex-1 overflow-y-auto px-2">
            {!hydrated || items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingCart className="size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Your cart is empty.
                </p>
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/shop">Browse shop</Link>
                  </Button>
                </SheetClose>
              </div>
            ) : (
              <ul className="flex flex-col gap-3 py-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-xl border bg-card p-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.priceGhs, item.priceUsd, currency)}{" "}
                        each
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex items-center rounded-full border">
                          <button
                            onClick={() =>
                              setQuantity(item.id, item.quantity - 1)
                            }
                            className="grid size-7 place-items-center rounded-full hover:bg-muted"
                            aria-label="Decrease"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQuantity(item.id, item.quantity + 1)
                            }
                            className="grid size-7 place-items-center rounded-full hover:bg-muted"
                            aria-label="Increase"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="self-center text-right text-sm font-semibold">
                      {formatPrice(
                        item.priceGhs * item.quantity,
                        item.priceUsd * item.quantity,
                        currency
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {hydrated && items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">
                  {currency === "USD"
                    ? `$${totals.totalUsd.toFixed(2)}`
                    : `GH₵${totals.totalGhs.toFixed(2)}`}
                </span>
              </div>
              <Button
                onClick={startCheckout}
                className="h-12 w-full rounded-full bg-[#00394f] text-base font-bold hover:bg-[#00293a]"
              >
                Checkout
              </Button>
              <button
                onClick={() => clear()}
                className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-destructive"
              >
                Clear cart
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              You&apos;re paying in {currency}. Total{" "}
              <strong>
                {currency === "USD"
                  ? `$${totals.totalUsd.toFixed(2)}`
                  : `GH₵${totals.totalGhs.toFixed(2)}`}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePay} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Full name</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">Phone</Label>
              <Input
                id="c-phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-addr">Delivery address</Label>
              <Textarea
                id="c-addr"
                rows={2}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={paying}
                className="h-11 w-full rounded-full bg-[#00394f] font-bold hover:bg-[#00293a]"
              >
                {paying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  `Pay ${
                    currency === "USD"
                      ? `$${totals.totalUsd.toFixed(2)}`
                      : `GH₵${totals.totalGhs.toFixed(2)}`
                  }`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success dialog (test mode / verified) */}
      <Dialog open={!!done} onOpenChange={(o) => !o && setDone(null)}>
        <DialogContent className="max-w-sm text-center">
          <CheckCircle2 className="mx-auto size-14 text-green-500" />
          <DialogHeader>
            <DialogTitle>Payment successful</DialogTitle>
            <DialogDescription>
              Thank you! Your order reference is{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {done?.ref}
              </code>
              . We&apos;ll email you a confirmation.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setDone(null)}
            className="h-11 w-full rounded-full bg-[#00394f] font-bold hover:bg-[#00293a]"
          >
            Continue shopping
          </Button>
        </DialogContent>
      </Dialog>
       {/* Login-required popup */}                                  
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        message="You need to be logged in to checkout and make payments."
      />
    </>
  );
}

export { type CartItem };