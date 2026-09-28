"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Sparkles, Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

type Message = {
  role: "user" | "assistant";
  content: string;
  recommendations?: Product[];
};

type ShopAssistantProps = {
  currency: "GHS" | "USD";
  onAddToCart: (product: Product) => void;
};

const starters = ["Help me choose a guitar", "Show me beginner-friendly items", "What’s in stock?"];

export function ShopAssistant({ currency, onAddToCart }: ShopAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to the shop. Tell me what you play, what you’re looking for, or your budget, and I’ll find a good match from today’s inventory.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending, open]);

  async function sendMessage(preset?: string) {
    const content = (preset ?? input).trim();
    if (!content || pending) return;

    const history = messages.map(({ role, content: text }) => ({ role, content: text }));
    setMessages((current) => [...current, { role: "user", content }]);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/shop-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
          recommendations: data.recommendations,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I couldn’t check the shop just now. Please try again in a moment." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section
          aria-label="Bestcoach shop assistant"
          className="mb-3 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
        >
          <header className="flex items-center justify-between border-b bg-[#00394f] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-white/15">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">Shop assistant</h2>
                <p className="text-xs text-white/75">Live product and stock help</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close shop assistant"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/15 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={message.role === "user" ? "ml-7" : "mr-3"}>
                <p
                  className={`whitespace-pre-wrap rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#00394f] text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </p>
                {message.recommendations?.length ? (
                  <div className="mt-2 space-y-2">
                    {message.recommendations.map((product) => (
                      <article key={product.id} className="flex gap-3 rounded-lg border p-2">
                        <img
                          src={product.image}
                          alt=""
                          className="size-14 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(product.priceGhs, product.priceUsd, currency)}
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            className="mt-1 h-7 px-2 text-xs"
                            onClick={() => onAddToCart(product)}
                          >
                            <ShoppingBag className="mr-1 size-3" /> Add to cart
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {pending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> Checking the shop...
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    disabled={pending}
                    onClick={() => void sendMessage(starter)}
                    className="rounded-full border px-3 py-1.5 text-left text-xs transition hover:border-[#00394f] hover:bg-muted disabled:opacity-50"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="flex items-center gap-2 border-t p-3"
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              placeholder="Ask about instruments or gear"
              aria-label="Message the shop assistant"
              disabled={pending}
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={pending || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      )}
      <Button
        type="button"
        size="icon"
        aria-label={open ? "Close shop assistant" : "Open shop assistant"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="size-14 rounded-full bg-[#00394f] text-white shadow-xl hover:bg-[#00293a]"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}