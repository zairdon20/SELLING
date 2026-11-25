// TwendaChina storefront currency helpers.
//
// The store targets the Zambian market, so every product.price and
// order.totalAmount value is stored and treated as Zambian Kwacha (ZMW).
// `formatZmw` is the canonical formatter used across the storefront, cart,
// checkout and admin surfaces.

const ZMW_SYMBOL = "K";

/**
 * Format a numeric amount as Zambian Kwacha, e.g. 2133 -> "K2,133.00".
 *
 * A manual formatter is used (rather than Intl with currency: "ZMW") so the
 * output is stable across Node/ICU versions and always reads "K1,234.56".
 */
export function formatZmw(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  return `${ZMW_SYMBOL}${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Kept for backward compatibility with code that still imports `formatUsd`.
 * It now formats as Kwacha (the store's single currency) — the name is
 * retained only to avoid breaking existing imports during the currency switch.
 */
export const formatUsd = formatZmw;
