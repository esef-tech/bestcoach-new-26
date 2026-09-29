export function isPaystackLiveMode(): boolean {
  return process.env.PAYSTACK_MODE?.toLowerCase() !== "test";
}

export function getPaystackSecretKey(): string | null {
  if (isPaystackLiveMode()) {
    return (
      process.env.PAYSTACK_LIVE_SECRET_KEY ||
      process.env.PAY_STACK_LIVE_SECRET_KEY ||
      null
    );
  }

  return process.env.PAYSTACK_API_KEY || process.env.PAYSTACK_SECRET_KEY || null;
}