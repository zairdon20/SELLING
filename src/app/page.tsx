"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

// WhatsApp number - change this to your actual number (without + or spaces)
const WHATSAPP_NUMBER = "260968570833";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError("Failed to load products. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const phonesProducts = products.filter((p) => p.category === "phones");
  const tabletsProducts = products.filter((p) => p.category === "tablets");
  const computersProducts = products.filter((p) => p.category === "computers");
  const featuredProduct =
    products.find((p) => p.id === "phones-1") ||
    products.find((p) => p.featured) ||
    products[0] ||
    null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-neutral-900" />
          <p className="mt-4 text-muted-foreground">Loading TwendaChina...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => { setError(null); setLoading(true); fetchProducts(); }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection product={featuredProduct} whatsappNumber={WHATSAPP_NUMBER} />

        <CategorySection
          id="phones"
          title="Phones"
          subtitle="Flagship smartphones from Apple, Samsung, Google and more — the latest models with the best cameras and fastest chips."
          products={phonesProducts}
          whatsappNumber={WHATSAPP_NUMBER}
          variant="phones"
        />

        <CategorySection
          id="tablets"
          title="Tablets"
          subtitle="iPads and Android tablets for work, study and play — stunning displays, all-day battery, and Apple Pencil or S Pen support."
          products={tabletsProducts}
          whatsappNumber={WHATSAPP_NUMBER}
          variant="tablets"
        />

        <CategorySection
          id="computers"
          title="Computers"
          subtitle="MacBooks, ultrabooks and gaming laptops powered by M-series, Intel and AMD — built for productivity, creativity and play."
          products={computersProducts}
          whatsappNumber={WHATSAPP_NUMBER}
          variant="computers"
        />
      </main>

      <Footer whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  );
}
