"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/product";

interface CategorySectionProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
  whatsappNumber: string;
  variant: "phones" | "tablets" | "computers";
}

const categoryStyles = {
  phones: {
    gradient: "from-blue-700 via-blue-600 to-indigo-600",
    accent: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    highlight: "bg-blue-600",
    pattern: "from-blue-100/50 to-transparent",
    hoverBg: "hover:bg-blue-600",
    heroImage: "/images/electronics/phone-1.jpg",
    heroOverlay: "from-blue-900/80 via-blue-900/50 to-transparent",
    badgeBg: "bg-white/10 border-white/30",
    badgeText: "text-white",
    titleText: "text-white",
    subtitleText: "text-blue-100",
  },
  tablets: {
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    accent: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    highlight: "bg-violet-600",
    pattern: "from-violet-100/50 to-transparent",
    hoverBg: "hover:bg-violet-600",
    heroImage: "/images/electronics/tablet-1.jpg",
    heroOverlay: "from-violet-900/70 via-violet-800/40 to-transparent",
    badgeBg: "bg-white/10 border-white/30",
    badgeText: "text-white",
    titleText: "text-white",
    subtitleText: "text-violet-100",
  },
  computers: {
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accent: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    highlight: "bg-emerald-600",
    pattern: "from-emerald-100/50 to-transparent",
    hoverBg: "hover:bg-emerald-600",
    heroImage: "/images/electronics/computer-1.jpg",
    heroOverlay: "from-emerald-900/70 via-teal-800/40 to-transparent",
    badgeBg: "bg-white/10 border-white/30",
    badgeText: "text-white",
    titleText: "text-white",
    subtitleText: "text-emerald-100",
  },
};

const categoryLinks = {
  phones: "/phones",
  tablets: "/tablets",
  computers: "/computers",
};

export function CategorySection({
  id,
  title,
  subtitle,
  products,
  whatsappNumber,
  variant,
}: CategorySectionProps) {
  const styles = categoryStyles[variant];
  const link = categoryLinks[variant];

  return (
    <section id={id} className={`${styles.bg}`}>
      {/* Hero Banner with background image */}
      <div
        className="relative w-full h-64 md:h-80 overflow-hidden"
        style={{
          backgroundImage: `url(${styles.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.heroOverlay}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${styles.badgeBg} backdrop-blur mb-4`}>
            <Sparkles className={`h-4 w-4 ${styles.badgeText}`} />
            <span className={`text-sm font-medium ${styles.badgeText}`}>
              {title} Collection
            </span>
          </div>
          <h2 className={`text-3xl md:text-5xl font-bold ${styles.titleText} drop-shadow-lg`}>
            {title}
          </h2>
          <p className={`${styles.subtitleText} mt-3 max-w-2xl mx-auto text-sm md:text-base drop-shadow`}>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                  variant={variant}
                />
              ))}
            </div>

            {/* View All Button */}
            {products.length >= 4 && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  className={`gap-2 ${styles.border} ${styles.accent} ${styles.hoverBg} hover:text-white transition-colors`}
                  asChild
                >
                  <Link href={link}>
                    View All {title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${styles.bg} ${styles.border} border mb-4`}>
              <span className="text-4xl">
                {variant === "phones" ? "📱" : variant === "tablets" ? "💻" : "🖥️"}
              </span>
            </div>
            <p className="text-muted-foreground">
              No products in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
