export function getPaystackSecretKey(): string | null {
  if (process.env.PAYSTACK_MODE?.toLowerCase() === "live") {
    return process.env.PAYSTACK_LIVE_SECRET_KEY || null;
  }

  return process.env.PAYSTACK_API_KEY || process.env.PAYSTACK_SECRET_KEY || null;
}