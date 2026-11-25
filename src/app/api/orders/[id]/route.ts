import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/orders/[id]
 *
 * Public read of a single order by id, used by the checkout success page.
 * The id is an unguessable cuid, so exposing it on the confirmation page is
 * safe. Returns parsed line items + note (shipping, payment status) but never
 * anything beyond what the customer already entered.
 */

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Order id is required" },
      { status: 400 }
    );
  }

  try {
    const order = await db.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    let items: unknown[] = [];
    try {
      items = order.items ? JSON.parse(order.items) : [];
    } catch {
      items = [];
    }

    let note: Record<string, unknown> = {};
    try {
      note = order.note ? JSON.parse(order.note) : {};
    } catch {
      note = {};
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        items,
        totalAmount: order.totalAmount,
        status: order.status,
        note,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
