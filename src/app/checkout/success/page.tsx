"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { formatZmw } from "@/lib/currency";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Home,
  Clock,
} from "lucide-react";

const WHATSAPP_NUMBER = "260968570833";

interface OrderLine {
  productName?: string;
  name?: string;
  price?: number;
  qty?: number;
  size?: string;
  color?: string;
  lineTotal?: number;
}

interface OrderResponse {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: OrderLine[];
  totalAmount: number;
  status: string;
  note: Record<string, unknown>;
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const status = params.get("status"); // "paid" | "failed" | null
  const reference = params.get("reference");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearCart = useCart((s) => s.clear);

  useEffect(() => {
    // Clear the cart once we've landed on a paid confirmation — the order is
    // already persisted server-side, so the local cart is now redundant.
    if (status === "paid") {
      clearCart();
    }
  }, [status, clearCart]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (active) {
          if (data.success) {
            setOrder(data.order);
          } else {
            setError(data.error || "Order not found");
          }
        }
      } catch {
        if (active) setError("Could not load your order details");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId]);

  const isPaid = status === "paid" || order?.status === "confirmed";
  const isTest =
    (order?.note?.testMode as boolean) === true ||
    (order?.note?.paymentStatus as string) === "test-paid";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Confirming your order…</p>
            </div>
          ) : status === "failed" ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <div>
                  <h1 className="text-xl font-bold">Payment was not completed</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your cart is still saved. Try again whenever you're ready.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/checkout">Back to checkout</Link>
                </Button>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <div>
                  <h1 className="text-xl font-bold">We couldn't find that order</h1>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <Button asChild>
                  <Link href="/">Back home</Link>
                </Button>
              </CardContent>
            </Card>
          ) : order ? (
            <div className="space-y-6">
              {/* Hero confirmation */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <h1 className="mt-4 text-2xl sm:text-3xl font-bold">
                  Thank you, {order.customerName.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your order has been received
                  {isPaid ? " and payment confirmed" : ""}.
                </p>
                {isTest && (
                  <Badge variant="secondary" className="mt-3 gap-1">
                    <Clock className="h-3 w-3" />
                    Test mode — no live payment taken
                  </Badge>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order details
                    </span>
                    <Badge variant="outline">#{order.id.slice(-8).toUpperCase()}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reference</p>
                      <p className="font-medium truncate">
                        {reference || (order.note?.paystackReference as string) || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium truncate">
                        {order.customerEmail || "—"}
                      </p>
                    </div>
                  </div>

                  {(order.note?.address as string) && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Deliver to</p>
                      <p className="font-medium">
                        {order.note.address as string}, {order.note.city as string},{" "}
                        {order.note.province as string}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <ul className="space-y-2 text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between gap-3">
                        <span className="min-w-0">
                          <span className="font-medium">
                            {item.productName || item.name}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            · {item.size} · {item.color} · Qty {item.qty}
                          </span>
                        </span>
                        <span className="font-medium whitespace-nowrap">
                          {formatZmw(
                            (item.lineTotal ?? (item.price ?? 0) * (item.qty ?? 0))
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Separator />

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        {formatZmw((order.note?.subtotal as number) ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>
                        {formatZmw((order.note?.deliveryFee as number) ?? 0)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total paid</span>
                    <span className="text-xl font-bold">
                      {formatZmw(order.totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4 text-sm text-muted-foreground">
                  <p>
                    We'll call you on{" "}
                    <span className="font-medium text-foreground">
                      {order.customerPhone}
                    </span>{" "}
                    to confirm delivery details. For any questions, reach us on{" "}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-700 hover:underline"
                    >
                      WhatsApp
                    </a>{" "}
                    with your order reference.
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Back to home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/phones">Continue shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No order id provided.
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  );
}
