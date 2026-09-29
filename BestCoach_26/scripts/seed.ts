/* Seed the shop with sample products. Run with: bun run scripts/seed.ts */
import { db } from "../src/lib/db";

const products = [
  { name: "Piano Sit(Black)", description: "Heavy-duty Sit for piano & keyboard. Fits for all.", priceGhs: 45, priceUsd: 4.0, image: "https://shop.musora.com/cdn/shop/files/Prima_Piano_Full_Set_1.jpg?v=1763420666&width=720", category: "Accessories" },
  { name: "100 Days of Practice Poster", description: "100 days of practice poster for musicians.", priceGhs: 80, priceUsd: 7.0, image: "https://shop.musora.com/cdn/shop/files/100_Days_Of_Practice.png?v=1765491769&width=550", category: "Books" },
  { name: "Practice Kit", description: "Practice kit for musicians.", priceGhs: 25, priceUsd: 2.5, image: "https://shop.musora.com/cdn/shop/files/PracticeKit-Main.jpg?v=1751492805&width=1445", category: "Accessories" },
  { name: "Headphones", description: "Lightweight over-ear headphones with noise cancellation.", priceGhs: 120, priceUsd: 10.0, image: "https://shop.musora.com/cdn/shop/files/pianote-headphones-MAIN_84d20bad-a3f5-4a9e-ba2f-242ffe03f6ac.jpg?v=1763503994&width=1445", category: "Equipment" },
  { name: "Piano Metronome", description: "Piano metronome for practice sessions.", priceGhs: 90, priceUsd: 8.0, image: "https://shop.musora.com/cdn/shop/files/Metronomered-Main.jpg?v=1751492602&width=1445", category: "Equipment" },
  { name: "Folding Music Stand", description: "Lightweight folding music stand with carry bag. Adjustable height.", priceGhs: 75, priceUsd: 6.5, image: "https://images.unsplash.com/photo-1630082255452-3301fabbaf96?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "Accessories" },
  { name: "Instrument Cable", description: "Instrument cable for connecting your gear.", priceGhs: 50, priceUsd: 4.5, image: "https://plus.unsplash.com/premium_photo-1760502350727-9761f0ae2a7c?q=80&w=812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "Accessories" },
  { name: "Digital Metronome", description: "Digital metronome with tempo, beat patterns and tap tempo.", priceGhs: 60, priceUsd: 5.5, image: "https://images.unsplash.com/photo-1774039890111-45c7637366b1?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "Equipment" },
  { name: "Music T-Shirt", description: "100% cotton tee with the Bestcoach Music logo. Unisex sizes.", priceGhs: 75, priceUsd: 6.5, image: "https://plus.unsplash.com/premium_photo-1682096489563-bec7c2ad27fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "Merch" },
  { name: "Music Mug", description: "Ceramic mug for your rehearsal coffee. Dishwasher safe.", priceGhs: 50, priceUsd: 4.5, image: "https://placeit.net/c/mockups/stages/15-oz-coffee-mug-mockup-featuring-a-long-haired-woman-33176/editor?colorFolder_Mug%20Color=%23FFFFFF&customG_0=tm3h0w5ef1&draftId=62006406", category: "Merch" },
  { name: "Classic Piano Book", description: "A comprehensive guide to classical piano playing.", priceGhs: 95, priceUsd: 8.5, image: "https://shop.musora.com/cdn/shop/files/Classicalpianopicese_actuallyplay_-Main.jpg?v=1751492562&width=1445", category: "Books" },
  { name: "Read Music Book", description: "A guide to reading music for beginners.", priceGhs: 55, priceUsd: 5.0, image: "https://shop.musora.com/cdn/shop/files/RMI30D-book-cart.jpg?v=1717527137&width=550", category: "Books" },
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