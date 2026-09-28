"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";                                    
import { AuthPromptDialog } from "@/components/bestcoach/auth-prompt";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart, formatPrice, type CartItem } from "@/lib/cart-store";
import { TopBar } from "@/components/bestcoach/topbar";
import { Navbar } from "@/components/bestcoach/navbar";
import { Footer } from "@/components/bestcoach/footer";
import { ShopAssistant } from "@/components/bestcoach/shop-assistant";
import { refreshUserNotifications } from "@/lib/notification-events";

type Product = {
  id: string;
  name: string;
  description: string;
  priceGhs: number;
  priceUsd: number;
  image: string;
  category: string;
  stock: number;
};

function ShopInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { currency, setCurrency, addItem, hydrated } = useCart();
  const { status } = useSession();                          // ← add
  const authenticated = status === "authenticated"; 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");
  const [authPromptOpen, setAuthPromptOpen] = useState(false); 

  const handleAssistantAdd = (product: Product) => {
    if (!authenticated) {
      setAuthPromptOpen(true);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      priceGhs: product.priceGhs,
      priceUsd: product.priceUsd,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  // Load products
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.ok) setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle Paystack return: ?reference=xxx
  useEffect(() => {
    const ref = params.get("reference");
    const paystack = params.get("paystack");
    if (ref && paystack) {
      (async () => {
        try {
          const res = await fetch(
            `/api/paystack/verify?reference=${encodeURIComponent(ref)}`
          );
          const data = await res.json();
          if (data.ok && data.status === "paid") {
            toast.success("Payment confirmed! 🎉");
            refreshUserNotifications();
          } else if (data.ok && data.status === "failed") {
            toast.error("Payment failed.");
          } else {
            toast.info("Payment is still pending.");
          }
        } catch (err) {
          console.error(err);
        } finally {
          router.replace("/shop");
        }
      })();
    }
  }, [params, router]);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter((p) => {
    const matchesCat = activeCat === "All" || p.category === activeCat;
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  if (loading) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <AuthPromptDialog
          open={authPromptOpen}
          onOpenChange={setAuthPromptOpen}
        />
        <ShopAssistant currency={currency} onAddToCart={handleAssistantAdd} />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <Badge className="mb-3 bg-accent/20 text-accent-foreground">
          Bestcoach Music
        </Badge>
        <h1 className="text-3xl font-bold text-[#00394f] md:text-4xl">
          The Bestcoach Shop
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Music accessories, instruments, books and merch — shipped from Accra.
          Pay in Ghana Cedis or US Dollars.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCat === c
                  ? "bg-[#00394f] text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {/* Currency toggle */}
        <div className="flex items-center gap-1 rounded-full bg-muted p-1 text-sm">
          {(["GHS", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`flex-1 rounded-full px-4 py-1.5 font-medium transition ${
                currency === c
                  ? "bg-[#00394f] text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "GHS" ? "GH₵ GHS" : "$ USD"}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <ShoppingBag className="size-10 text-muted-foreground/40" />
          <p>No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="size-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <Badge variant="secondary" className="mb-2 w-fit text-xs">
                  {p.category}
                </Badge>
                <h3 className="text-base font-semibold leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#00394f]">
                    {formatPrice(p.priceGhs, p.priceUsd, currency)}
                  </span>
                  {p.stock <= 0 ? (
                    <Badge variant="destructive">Sold out</Badge>
                  ) : (
                                       <Button
                      size="sm"
                      onClick={() => {
                        if (!authenticated) {            // ← gate
                          setAuthPromptOpen(true);
                          return;
                        }
                        addItem({
                          id: p.id,
                          name: p.name,
                          priceGhs: p.priceGhs,
                          priceUsd: p.priceUsd,
                          image: p.image,
                        });
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="rounded-full bg-[#00394f] hover:bg-[#00293a]"
                    >
                      <Plus className="size-4" /> Add
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

            {/* Back to home */}
      <div className="mt-12 text-center">
        <Link
          href="/#home"
          className="text-sm font-medium text-amber-500 hover:text-amber-600"
        >
          ← Back to home
        </Link>
      </div>

      {/* Login-required popup */}                    
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
      />
      <ShopAssistant
        currency={currency}
        onAddToCart={handleAssistantAdd}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <ShopInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export { type CartItem };