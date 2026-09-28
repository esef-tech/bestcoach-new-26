import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function findMatches(
  message: string,
  products: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    priceGhs: number;
    priceUsd: number;
    stock: number;
  }>
) {
  const words = message.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const stopWords = new Set([
    "a", "an", "and", "are", "can", "for", "find", "get", "help", "i",
    "in", "is", "me", "my", "of", "or", "please", "recommend", "show",
    "some", "that", "the", "to", "want", "what", "with",
  ]);
  const terms = words.filter((word) => word.length > 2 && !stopWords.has(word));

  return products
    .filter((product) => product.stock > 0)
    .map((product) => {
      const searchable = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
      return { product, score };
    })
    .sort((left, right) => right.score - left.score || left.product.name.localeCompare(right.product.name))
    .filter(({ score }) => terms.length === 0 || score > 0)
    .slice(0, 3)
    .map(({ product }) => product);
}

function makeFallbackReply(message: string, matches: Array<{ name: string; stock: number }>) {
  if (!matches.length) {
    return "I couldn’t find an in-stock item matching that just now. Tell me which instrument or accessory you need, and I’ll check the shop again.";
  }

  const list = matches.map((product) => product.name).join(", ");
  if (/stock|available|availability|left/i.test(message)) {
    return `I checked the latest shop inventory. These matching items are available: ${list}.`;
  }

  return `Based on what you’re looking for, these in-stock items may fit: ${list}. Open any item below for its current price, or tell me your instrument, level, and budget for a closer match.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
          .filter(
            (item: unknown): item is ChatMessage =>
              typeof item === "object" &&
              item !== null &&
              "role" in item &&
              (item.role === "user" || item.role === "assistant") &&
              "content" in item &&
              typeof item.content === "string"
          )
          .slice(-8)
          .map((item: ChatMessage) => ({
            role: item.role,
            content: item.content.slice(0, 1000),
          }))
      : [];

    if (!message || message.length > 500) {
      return NextResponse.json(
        { ok: false, message: "Please enter a message of 1 to 500 characters." },
        { status: 400 }
      );
    }

    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        priceGhs: true,
        priceUsd: true,
        image: true,
        stock: true,
      },
      orderBy: { createdAt: "asc" },
    });
    const recommendations = findMatches(message, products);
    let reply: string;

    try {
      const { default: ZAI } = await import("z-ai-web-dev-sdk");
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are Bestcoach Music Shop Assistant. Help shoppers choose music instruments, accessories, books, and merchandise. Be warm, concise, and practical. Use only the inventory facts below for product, price, and stock claims. Never invent shipping times, policies, specifications, or discounts. Ask one short clarifying question when needed. Do not claim to place an order. Current inventory (prices in GHS and USD): ${JSON.stringify(products)}`,
          },
          ...history,
          { role: "user", content: message },
        ],
        thinking: { type: "disabled" },
      });
      const content = completion.choices?.[0]?.message?.content;
      reply = typeof content === "string" && content.trim()
        ? content.trim().slice(0, 1200)
        : makeFallbackReply(message, recommendations);
    } catch {
      reply = makeFallbackReply(message, recommendations);
    }

    return NextResponse.json({ ok: true, reply, recommendations });
  } catch (error) {
    console.error("[shop-assistant] error:", error);
    return NextResponse.json(
      { ok: false, message: "The shop assistant is unavailable right now. Please try again." },
      { status: 500 }
    );
  }
}