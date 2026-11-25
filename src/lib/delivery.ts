/**
 * Zambian delivery helpers shared by the client (checkout preview) and the
 * server (checkout pricing, source of truth).
 *
 * Delivery is a flat fee per province: cheaper within Lusaka (where the store
 * can hand-deliver) and a standard rate for the rest of the country. Adjust
 * these values or swap for a carrier API as the store scales.
 */

export const ZAMBIA_PROVINCES = [
  "Lusaka",
  "Copperbelt",
  "Central",
  "Southern",
  "Eastern",
  "Northern",
  "Muchinga",
  "Luapula",
  "North-Western",
  "Western",
] as const;

export type ZambiaProvince = (typeof ZAMBIA_PROVINCES)[number];

/** Delivery fee in ZMW for a given province. */
export function deliveryFeeFor(province: string | undefined | null): number {
  return province === "Lusaka" ? 50 : 120;
}
