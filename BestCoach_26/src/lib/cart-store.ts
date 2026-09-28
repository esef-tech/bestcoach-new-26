import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  priceGhs: number;
  priceUsd: number;
  image: string;
  quantity: number;
};

type Currency = "GHS" | "USD";

type CartState = {
  items: CartItem[];
  currency: Currency;
  hydrated: boolean;
  setCurrency: (c: Currency) => void;
  setHydrated: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      currency: "GHS",
      hydrated: false,
      setCurrency: (currency) => set({ currency }),
      setHydrated: () => set({ hydrated: true }),
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.id === id ? { ...i, quantity: Math.max(0, qty) } : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "bestcoach-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export const formatPrice = (ghs: number, usd: number, currency: Currency) => {
  if (currency === "USD") {
    return `$${usd.toFixed(2)}`;
  }
  return `GH₵${ghs.toFixed(2)}`;
};

export const cartTotals = (items: CartItem[]) => {
  const totalGhs = items.reduce((sum, i) => sum + i.priceGhs * i.quantity, 0);
  const totalUsd = items.reduce((sum, i) => sum + i.priceUsd * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { totalGhs, totalUsd, count };
};