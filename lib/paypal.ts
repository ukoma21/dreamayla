export function paypalBase() {
  const environment = process.env.PAYPAL_ENV?.toLowerCase();
  if (environment) {
    if (!['live', 'sandbox'].includes(environment)) throw new Error('Invalid PayPal environment');
    return environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  }
  const base = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';
  if (!['https://api-m.paypal.com', 'https://api-m.sandbox.paypal.com'].includes(base)) throw new Error('Invalid PayPal API URL');
  return base;
}

let cachedToken: { value: string; expiresAt: number } | undefined;

export async function paypalToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  const id = process.env.PAYPAL_CLIENT_ID, secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PayPal is not configured');
  const response = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials', cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('PayPal authentication failed');
  const data = await response.json() as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('PayPal authentication failed');
  // Keep a short safety margin before PayPal's expiry. Serverless instances
  // still fall back to a fresh token whenever they are cold-started.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + Math.max(30, (data.expires_in ?? 300) - 60) * 1000 };
  return cachedToken.value;
}
