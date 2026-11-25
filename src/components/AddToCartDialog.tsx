"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatZmw } from "@/lib/currency";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/types/product";

interface AddToCartDialogProps {
  product: Product;
  /** Optional className applied to the trigger button. */
  triggerClassName?: string;
  /** Visual variant driving accent colours, mirroring ProductCard. */
  variant?: "phones" | "tablets" | "computers";
}

export function AddToCartDialog({
  product,
  triggerClassName,
  variant = "phones",
}: AddToCartDialogProps) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(product.sizes[0] ?? "Standard");
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [qty, setQty] = useState(1);
  const { toast } = useToast();
  const addItem = useCart((s) => s.addItem);

  const accent =
    variant === "tablets"
      ? "bg-violet-600 hover:bg-violet-700"
      : variant === "computers"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-blue-600 hover:bg-blue-700";

  const handleAdd = () => {
    addItem(product, size, color, qty);
    toast({
      title: "Added to cart",
      description: `${qty} × ${product.name} (${size}, ${color})`,
    });
    setOpen(false);
    setQty(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn("w-full gap-2 text-white", accent, triggerClassName)}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {product.name}
            <Badge variant="secondary" className="text-xs">
              {formatZmw(product.price)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Pick your storage and colour, then add to your cart.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl opacity-50">
                📱
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-4">
            {product.description}
          </p>
        </div>

        {/* Storage (first variant) */}
        {product.sizes.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Storage
            </Label>
            <RadioGroup
              value={size}
              onValueChange={setSize}
              className="flex flex-wrap gap-2"
            >
              {product.sizes.map((s) => (
                <Label
                  key={s}
                  htmlFor={`size-${product.id}-${s}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "hover:bg-muted"
                  )}
                >
                  <RadioGroupItem
                    value={s}
                    id={`size-${product.id}-${s}`}
                    className="sr-only"
                  />
                  {s}
                  {size === s && <Check className="h-3 w-3" />}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Colour */}
        {product.colors.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Colour
            </Label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    color === c
                      ? "border-foreground bg-foreground text-background"
                      : "hover:bg-muted"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Quantity
          </Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="ml-auto text-sm text-muted-foreground">
              Subtotal:{" "}
              <span className="font-semibold text-foreground">
                {formatZmw(product.price * qty)}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Continue shopping
          </Button>
          <Button className={cn("gap-2 text-white", accent)} onClick={handleAdd}>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
