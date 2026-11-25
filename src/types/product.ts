// TwendaChina is an electronics store. The three product categories are the
// three gadget families the shop carries.
export type ProductCategory = "phones" | "tablets" | "computers";

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Price in Zambian Kwacha (ZMW). */
  price: number;
  category: ProductCategory;
  imageUrl: string;
  /**
   * Selectable first variant — for electronics this is the storage tier
   * (e.g. "128GB", "256GB") or screen/RAM option. Kept as `sizes` so the
   * existing product-card / cart variant UI works unchanged.
   */
  sizes: string[];
  /** Selectable second variant — the physical colour/finish. */
  colors: string[];
  featured: boolean;
  createdAt: string;
}
