"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

import { useCart, cartSubtotal } from "@/lib/cart-store";
import { formatZmw } from "@/lib/currency";
import { ZAMBIA_PROVINCES, deliveryFeeFor } from "@/lib/delivery";
import {
  Loader2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from "lucide-react";

const WHATSAPP_NUMBER = "260968570833";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number, e.g. 0971234567"),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(3, "Enter your delivery address"),
  city: z.string().trim().min(1, "Enter your city or town"),
  province: z.string().min(1, "Select your province"),
  notes: z.string().trim().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function CheckoutPage() {
  const mounted = useHasMounted();
  const { toast } = useToast();

  const items = useCart((s) => s.items);
  const subtotal = useCart(cartSubtotal);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      notes: "",
    },
    mode: "onBlur",
  });

  const province = form.watch("province");
  const deliveryFee = mounted ? deliveryFeeFor(province) : 0;
  const total = subtotal + deliveryFee;
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: CheckoutValues) => {
    if (!items.length) {
      toast({
        title: "Your cart is empty",
        description: "Add an item before checking out.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer: values,
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          qty: i.qty,
        })),
      };

      const res = await fetch("/api/checkout/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not start checkout.");
      }

      // Both live (Paystack authorization_url) and test-mode (relative path)
      // return an authorizationUrl to redirect to.
      if (data.testMode) {
        toast({
          title: "Test mode",
          description:
            "Paystack not configured — no live charge was made. Set PAYSTACK_SECRET_KEY to go live.",
        });
      }

      // Use a full-page redirect so we leave the app for Paystack's hosted page.
      window.location.href = data.authorizationUrl;
    } catch (error) {
      toast({
        title: "Checkout failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  // ── Loading gate (persisted cart hydration) ──
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const empty = items.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          href="/phones"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Checkout
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete your order and pay securely with Paystack in Kwacha (ZMW).
        </p>

        {empty ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
              <div>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add a few items and come back to check out.
                </p>
              </div>
              <Button asChild>
                <Link href="/phones">Browse the collection</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* ── Shipping form ── */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                id="checkout-form"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Delivery details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Banda" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0971234567"
                              inputMode="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="jane@example.com"
                              inputMode="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Delivery address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="House number, street, area"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City / Town</FormLabel>
                          <FormControl>
                            <Input placeholder="Lusaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ZAMBIA_PROVINCES.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>
                            Delivery notes{" "}
                            <span className="text-muted-foreground font-normal">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Landmark, preferred delivery time, etc."
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Submit (mobile) */}
                <Button
                  type="submit"
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white lg:hidden"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Pay {formatZmw(total)}
                </Button>
              </form>
            </Form>

            {/* ── Order summary ── */}
            <aside className="lg:sticky lg:top-20 self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className="flex gap-3"
                      >
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl opacity-50">
                              👔
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <span className="line-clamp-1 text-sm font-medium">
                              {item.name}
                            </span>
                            <span className="text-sm font-semibold whitespace-nowrap">
                              {formatZmw(item.price * item.qty)}
                            </span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap gap-1 text-xs text-muted-foreground">
                            <span>{item.size}</span>
                            <span>·</span>
                            <span>{item.color}</span>
                            <span>·</span>
                            <span>Qty {item.qty}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Separator />

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatZmw(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery{" "}
                        {province ? (
                          <span className="text-xs">({province})</span>
                        ) : null}
                      </span>
                      <span className="font-medium">
                        {province ? formatZmw(deliveryFee) : "—"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">{formatZmw(total)}</span>
                  </div>

                  {!province && (
                    <p className="text-xs text-muted-foreground">
                      Select your province to see the delivery fee.
                    </p>
                  )}

                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                    disabled={submitting || !province}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    Pay {formatZmw(total)} with Paystack
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Secured by Paystack · Payments in ZMW
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Prefer to order by chat?{" "}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-700 hover:underline"
                    >
                      Message us on WhatsApp
                    </a>
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </main>

      <Footer whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  );
}
