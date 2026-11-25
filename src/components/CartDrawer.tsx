"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart, cartCount, cartSubtotal, lineKey } from "@/lib/cart-store";
import { formatZmw } from "@/lib/currency";

/** Returns true after first client render — used to gate persisted-store UI
 *  so the server and client render the same initial markup. */
function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const mounted = useHasMounted();

  const items = useCart((s) => s.items);
  const count = useCart(cartCount);
  const subtotal = useCart(cartSubtotal);
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);

  const displayCount = mounted ? count : 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Open cart, ${displayCount} item${displayCount === 1 ? "" : "s"}`}
        >
          <ShoppingCart className="h-5 w-5" />
          {displayCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
              {displayCount > 99 ? "99+" : displayCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Your Cart</span>
            <Badge variant="secondary">
              {displayCount} item{displayCount === 1 ? "" : "s"}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {!mounted || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Browse the collection and add something you love.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/phones">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <ul className="flex flex-col gap-4 py-4">
                {items.map((item) => (
                  <li
                    key={lineKey(item.productId, item.size, item.color)}
                    className="flex gap-3"
                  >
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl opacity-50">
                          👔
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-1 text-sm font-semibold">
                          {item.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            removeItem(item.productId, item.size, item.color)
                          }
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {item.size}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {item.color}
                        </Badge>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQty(
                                item.productId,
                                item.size,
                                item.color,
                                item.qty - 1
                              )
                            }
                            disabled={item.qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQty(
                                item.productId,
                                item.size,
                                item.color,
                                item.qty + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatZmw(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <SheetFooter className="gap-2">
              <Separator />
              <div className="flex items-center justify-between px-1 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatZmw(subtotal)}</span>
              </div>
              <p className="px-1 text-xs text-muted-foreground">
                Delivery and taxes calculated at checkout.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" onClick={() => setOpen(false)}>
                  <Link href="/phones">Continue shopping</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
