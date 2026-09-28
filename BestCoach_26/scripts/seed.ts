/* Seed the shop with sample products. Run with: bun run scripts/seed.ts */
import { db } from "../src/lib/db";

const products = [
  { name: "Guitar Capo (Silver)", description: "Heavy-duty spring capo for acoustic & electric guitars. Fits most necks.", priceGhs: 45, priceUsd: 4.0, image: "https://shop.musora.com/products/pianote-bench-and-stand", category: "Accessories" },
  { name: "Clip-on Digital Tuner", description: "Chromatic clip-on tuner with bright colour display. 360° swivel.", priceGhs: 80, priceUsd: 7.0, image: "https://picsum.photos/seed/tuner/600/600", category: "Accessories" },
  { name: "Guitar Picks (Pack of 6)", description: "Mixed-gauge celluloid picks. Celluloid for warm tone.", priceGhs: 25, priceUsd: 2.5, image: "https://picsum.photos/seed/picks/600/600", category: "Accessories" },
  { name: "Folding Music Stand", description: "Lightweight folding music stand with carry bag. Adjustable height.", priceGhs: 120, priceUsd: 10.0, image: "https://picsum.photos/seed/stand/600/600", category: "Equipment" },
  { name: "Digital Metronome", description: "Pocket metronome with tempo, beat patterns and tap tempo.", priceGhs: 90, priceUsd: 8.0, image: "https://picsum.photos/seed/metronome/600/600", category: "Equipment" },
  { name: "Bestcoach T-Shirt", description: "100% cotton tee with the Bestcoach Music logo. Unisex sizes.", priceGhs: 75, priceUsd: 6.5, image: "https://picsum.photos/seed/tshirt/600/600", category: "Merch" },
  { name: "Bestcoach Mug", description: "Ceramic mug for your rehearsal coffee. Dishwasher safe.", priceGhs: 50, priceUsd: 4.5, image: "https://picsum.photos/seed/mug/600/600", category: "Merch" },
  { name: "Sheet Music Book", description: "Beginner-friendly sheet music collection across genres.", priceGhs: 60, priceUsd: 5.5, image: "https://picsum.photos/seed/sheetmusic/600/600", category: "Books" },
  { name: "Drumsticks (Pair, 5A)", description: "Hickory 5A drumsticks — balanced and durable. Pair.", priceGhs: 35, priceUsd: 3.0, image: "https://picsum.photos/seed/drumsticks/600/600", category: "Accessories" },
  { name: "Piano Method Book", description: "Step-by-step piano method for adult beginners.", priceGhs: 70, priceUsd: 6.0, image: "https://picsum.photos/seed/pianobook/600/600", category: "Books" },
  { name: "Guitar Strap (Leather)", description: "Genuine leather guitar strap, 2.5\" wide, adjustable.", priceGhs: 95, priceUsd: 8.5, image: "https://picsum.photos/seed/strap/600/600", category: "Accessories" },
  { name: "Instrument Cable (3m)", description: "Balanced 1/4\" instrument cable with woven jacket. 3 metres.", priceGhs: 55, priceUsd: 5.0, image: "https://picsum.photos/seed/cable/600/600", category: "Equipment" },
];

async function main() {
  console.log("Seeding products...");
  await db.product.deleteMany({});
  for (const p of products) {
    await db.product.create({ data: p });
  }
  const count = await db.product.count();
  console.log(`✅ Seeded ${count} products.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });