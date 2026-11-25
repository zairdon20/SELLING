/**
 * Paystack server-side helpers.
 *
 * IMPORTANT: only import this module from server code (Route Handlers, server
 * components). It reads the secret key from process.env and must never end up
 * in a client bundle.
 *
 * The store charges in Zambian Kwacha (ZMW). Paystack treats ZMW amounts in
 * its smallest subunit — the ngwee (1 ZMW = 100 ngwee) — so we multiply by 100
 * before sending.
 *
 * Flow:
 *   1. `initializeTransaction` → returns an `authorization_url` the client is
 *      redirected to (Paystack-hosted checkout page).
 *   2. Paystack redirects back to `callback_url` (?reference=...), which we
 *      handle in `/api/checkout/verify` via `verifyTransaction`.
 *
 * Required env:
 *   PAYSTACK_SECRET_KEY  – secret key from your Paystack dashboard
 *   PAYSTACK_CALLBACK_URL – (optional) absolute URL Paystack should redirect to
 *                          after payment; defaults to <origin>/api/checkout/verify
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export function getPaystackSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add it to .env.local to accept live payments."
    );
  }
  return key;
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export interface PaystackInitParams {
  email: string;
  amountZmw: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitResult {
  authorizationUrl: string;
  reference: string;
  accessCode?: string;
}

export async function initializeTransaction(
  params: PaystackInitParams
): Promise<PaystackInitResult> {
  const key = getPaystackSecretKey();
  const amountInNgwee = Math.round(params.amountZmw * 100); // 1 ZMW = 100 ngwee

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: amountInNgwee,
      currency: "ZMW",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || "Paystack initialization failed");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
    accessCode: data.data.access_code,
  };
}

export interface PaystackVerifyResult {
  status: "success" | "failed" | "abandoned" | string;
  amount: number; // ngwee
  currency: string;
  reference: string;
  gatewayResponse: string;
  customerEmail: string;
}

export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResult> {
  const key = getPaystackSecretKey();

  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${key}` },
    }
  );

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || "Paystack verification failed");
  }

  const d = data.data;
  return {
    status: d.status,
    amount: d.amount,
    currency: d.currency,
    reference: d.reference,
    gatewayResponse: d.gateway_response,
    customerEmail: d.customer?.email,
  };
}
