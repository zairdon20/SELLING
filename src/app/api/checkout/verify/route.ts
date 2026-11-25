import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";

/**
 * GET /api/checkout/verify?reference=...
 *
 * Paystack redirects here after the customer pays (or cancels) on the hosted
 * checkout page. We verify the transaction server-side, reconcile it to the
 * stored Order, mark it paid, then redirect to the success page with a status.
 *
 * The reference format we send to Paystack is `NYE-{orderId}-{ts}`, so we can
 * recover the orderId without a DB lookup. (The reference is also stored on
 * the order's `note` JSON as `paystackReference`.)
 */

function orderIdFromReference(reference: string): string | null {
  // NYE-<cuid>-<timestamp>  → cuid has no dashes, so parts[1] is the orderId.
  const parts = reference.split("-");
  if (parts.length >= 3 && parts[0] === "NYE") {
    return parts[1];
  }
  return null;
}

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  const trxref = request.nextUrl.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(new URL("/checkout?error=missing_reference", request.nextUrl.origin));
  }

  // Test-mode references never reach Paystack; just confirm and move on.
  if (reference.startsWith("TEST-")) {
    const orderId = reference.replace("TEST-", "");
    return NextResponse.redirect(
      new URL(`/checkout/success?orderId=${orderId}&reference=${reference}&status=paid`, request.nextUrl.origin)
    );
  }

  const orderId = orderIdFromReference(reference) ?? orderIdFromReference(trxref ?? "");

  const successBase = `/checkout/success`;
  const failureRedirect = new URL(
    orderId
      ? `${successBase}?orderId=${orderId}&reference=${reference}&status=failed`
      : `/checkout?error=verification_failed`,
    request.nextUrl.origin
  );

  try {
    const result = await verifyTransaction(reference);

    if (!orderId) {
      console.error("[checkout/verify] Could not derive orderId from reference", reference);
      return NextResponse.redirect(failureRedirect);
    }

    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.error("[checkout/verify] Order not found", orderId);
      return NextResponse.redirect(failureRedirect);
    }

    if (result.status === "success") {
      // Reconcile: update note with paid status + reference, flip status.
      const existingNote = (() => {
        try {
          return order.note ? JSON.parse(order.note) : {};
        } catch {
          return {};
        }
      })();

      await db.order.update({
        where: { id: order.id },
        data: {
          status: "confirmed",
          note: JSON.stringify({
            ...existingNote,
            paymentStatus: "paid",
            paystackReference: reference,
            gatewayResponse: result.gatewayResponse,
          }),
        },
      });

      return NextResponse.redirect(
        new URL(`${successBase}?orderId=${order.id}&reference=${reference}&status=paid`, request.nextUrl.origin)
      );
    }

    // Not success (failed / abandoned). Keep order as pending for retry.
    return NextResponse.redirect(failureRedirect);
  } catch (error) {
    console.error("[checkout/verify] Error verifying transaction:", error);
    return NextResponse.redirect(failureRedirect);
  }
}
