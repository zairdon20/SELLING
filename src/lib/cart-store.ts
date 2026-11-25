"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

/**
 * A single line in the shopping cart. A line is unique per
 * (product, size, color) combination — adding the same product in a
 * different size or color creates a new line.
 */
export interface CartItem {
  productId: string;
  name: string;
  /** Price per unit in ZMW (captured at add-time for display; the server
   *  re-prices from its own trusted price map at checkout). */
  price: number;
  imageUrl: string;
  category: string;
  size: string;
  color: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, qty: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
}

/** Stable identity for a cart line. */
export function lineKey(productId: string, size: string, color: string): string {
  return `${productId}__${size}__${color}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, size, color, qty) =>
        set((state) => {
          const key = lineKey(product.id, size, color);
          const existing = state.items.find(
            (i) => lineKey(i.productId, i.size, i.color) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.productId, i.size, i.color) === key
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
                size,
                color,
                qty: Math.max(1, qty),
              },
            ],
          };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              lineKey(i.productId, i.size, i.color) !==
              lineKey(productId, size, color)
          ),
        })),
      updateQty: (productId, size, color, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.productId, i.size, i.color) ===
              lineKey(productId, size, color)
                ? { ...i, qty: Math.max(1, qty) }
                : i
            ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "twendachina-cart",
      version: 1,
    }
  )
);

/** Total number of units in the cart (sum of quantities). */
export const cartCount = (s: CartState): number =>
  s.items.reduce((n, i) => n + i.qty, 0);

/** Cart subtotal in ZMW (sum of unit price × qty). Delivery is added at checkout. */
export const cartSubtotal = (s: CartState): number =>
  s.items.reduce((n, i) => n + i.qty * i.price, 0);
