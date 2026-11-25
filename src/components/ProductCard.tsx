"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Eye } from "lucide-react";
import type { Product } from "@/types/product";
import { formatZmw } from "@/lib/currency";
import { AddToCartDialog } from "./AddToCartDialog";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  variant?: "phones" | "tablets" | "computers";
}

const categoryColors = {
  phones: {
    bg: "bg-blue-600",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    hover: "hover:border-blue-400",
    accent: "bg-blue-50",
  },
  tablets: {
    bg: "bg-violet-600",
    text: "text-violet-700",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    hover: "hover:border-violet-400",
    accent: "bg-violet-50",
  },
  computers: {
    bg: "bg-emerald-600",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    hover: "hover:border-emerald-400",
    accent: "bg-emerald-50",
  },
};

export function ProductCard({ product, whatsappNumber, variant = "phones" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const colors = categoryColors[variant];
  
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in ${product.name} - ${formatZmw(product.price)}. Sizes available: ${product.sizes.join(", ") || "N/A"}. Colors: ${product.colors.join(", ") || "N/A"}. Can you provide more details?`
  );
  
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <Card
      className={`group relative overflow-hidden border-2 ${colors.border} ${colors.hover} transition-all duration-300 ${
        isHovered ? "shadow-xl scale-[1.02]" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${colors.accent}`}>
            <span className="text-6xl opacity-50">📱</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white"
            asChild
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Eye className="h-5 w-5" />
            </a>
          </Button>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <Badge className={`absolute top-3 left-3 ${colors.bg} text-white`}>
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className={`mb-2 ${colors.badge}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Badge>
            <h3 className="font-semibold text-foreground line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          <p className={`text-sm sm:text-lg font-bold whitespace-nowrap shrink-0 ${colors.text}`}>
            {formatZmw(product.price)}
          </p>
        </div>

        {/* Sizes & Colors */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <Badge key={size} variant="secondary" className="text-xs">
              {size}
            </Badge>
          ))}
          {product.sizes.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{product.sizes.length - 4}
            </Badge>
          )}
        </div>

        {/* Add to Cart + WhatsApp */}
        <div className="mt-4 flex flex-col gap-2">
          <AddToCartDialog product={product} variant={variant} />
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            asChild
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Contact on WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
