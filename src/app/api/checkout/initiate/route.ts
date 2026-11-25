import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { dummyProducts } from "@/lib/dummy-data";
import { deliveryFeeFor, ZAMBIA_PROVINCES } from "@/lib/delivery";
import {
  initializeTransaction,
  isPaystackConfigured,
} from "@/lib/paystack";
import { formatZmw } from "@/lib/currency";

/**
 * POST /api/checkout/initiate
 *
 * Body:
 *   customer: { name, phone, email, address, city, province, notes? }
 *   items:    [{ productId, size, color, qty }]
 *
 * The server re-prices every line from its own trusted price map (DB products
 * first, dummy-data fallback). Client-supplied prices are ignored entirely.
 * Creates a pending Order, then either initializes a Paystack transaction
 * (live) or short-circuits to the success page (test mode, when no secret key
 * is set) so the flow is fully testable without credentials.
 */

const itemSchema = z.object({
  productId: z.string().min(1),
  size: z.string(),
  color: z.string(),
  qty: z.number().int().min(1).max(99),
});

const initiateSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Name is required"),
    phone: z.string().trim().min(7, "A valid phone number is required"),
    email: z.string().trim().email("A valid email is required"),
    address: z.string().trim().min(3, "Delivery address is required"),
    city: z.string().trim().min(1, "City is required"),
    province: z.enum(ZAMBIA_PROVINCES as unknown as [string, ...string[]]),
    notes: z.string().trim().optional(),
  }),
  items: z.array(itemSchema).min(1, "Cart is empty"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = initiateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Please complete all required fields correctly.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const { customer, items } = parsed.data;

  try {
    // Build a trusted price map: DB products first, dummy fallback second.
    const priceMap = new Map<string, { name: string; price: number }>();
    for (const p of dummyProducts) {
      priceMap.set(p.id, { name: p.name, price: p.price });
    }
    try {
      const rows = await db.product.findMany({
        select: { id: true, name: true, price: true },
      });
      for (const r of rows) {
        priceMap.set(r.id, { name: r.name, price: r.price });
      }
    } catch {
      // DB unavailable — dummy fallback covers seeding/dev.
    }

    const orderItems: Array<{
      productId: string;
      productName: string;
      price: number;
      qty: number;
      size: string;
      color: string;
      lineTotal: number;
    }> = [];
    let subtotal = 0;
    for (const line of items) {
      const priced = priceMap.get(line.productId);
      if (!priced) {
        return NextResponse.json(
          {
            success: false,
            error: `A product in your cart is no longer available (id: ${line.productId}). Please remove it and try again.`,
          },
          { status: 400 }
        );
      }
      const lineTotal = priced.price * line.qty;
      subtotal += lineTotal;
      orderItems.push({
        productId: line.productId,
        productName: priced.name,
        price: priced.price,
        qty: line.qty,
        size: line.size,
        color: line.color,
        lineTotal,
      });
    }

    const deliveryFee = deliveryFeeFor(customer.province);
    const total = subtotal + deliveryFee;

    const notePayload = {
      address: customer.address,
      city: customer.city,
      province: customer.province,
      notes: customer.notes ?? null,
      deliveryFee,
      subtotal,
      currency: "ZMW",
      paymentStatus: "pending",
      paystackReference: null as string | null,
      testMode: false,
    };

    const order = await db.order.create({
      data: {
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        items: JSON.stringify(orderItems),
        totalAmount: total,
        status: "pending",
        note: JSON.stringify(notePayload),
      },
    });

    // ── Test mode: no Paystack secret key configured ──
    // Short-circuit to the success page so the full flow is demoable. No real
    // charge happens. Set PAYSTACK_SECRET_KEY in .env.local to go live.
    if (!isPaystackConfigured()) {
      const testNote = { ...notePayload, paymentStatus: "test-paid", testMode: true };
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "confirmed",
          note: JSON.stringify(testNote),
        },
      });
      const testRef = `TEST-${order.id}`;
      const url = `/checkout/success?orderId=${order.id}&reference=${testRef}&status=paid`;
      return NextResponse.json({
        success: true,
        authorizationUrl: url,
        reference: testRef,
        testMode: true,
        orderId: order.id,
        totalDisplay: formatZmw(total),
      });
    }

    // ── Live mode: initialize a Paystack transaction ──
    const reference = `NYE-${order.id}-${Date.now()}`;
    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL ||
      `${request.nextUrl.origin}/api/checkout/verify`;

    const init = await initializeTransaction({
      email: customer.email,
      amountZmw: total,
      reference,
      callbackUrl,
      metadata: {
        orderId: order.id,
        custom_fields: [
          { display_name: "Order ID", variable_name: "order_id", value: order.id },
          {
            display_name: "Customer",
            variable_name: "customer_name",
            value: customer.name,
          },
          {
            display_name: "Items",
            variable_name: "items_count",
            value: String(orderItems.length),
          },
        ],
      },
    });

    // Stash the reference on the order note so /verify can reconcile it.
    await db.order.update({
      where: { id: order.id },
      data: {
        note: JSON.stringify({ ...notePayload, paystackReference: reference }),
      },
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: init.authorizationUrl,
      reference: init.reference,
      orderId: order.id,
      totalDisplay: formatZmw(total),
    });
  } catch (error) {
    console.error("Checkout initiate error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while starting checkout. Please try again.",
      },
      { status: 500 }
    );
  }
}
