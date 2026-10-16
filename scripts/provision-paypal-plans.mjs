import crypto from "node:crypto";

const environment = process.env.PAYPAL_ENV?.toLowerCase();
if (environment && !['live', 'sandbox'].includes(environment)) throw new Error('PAYPAL_ENV must be live or sandbox.');
const base = environment ? (environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com') : process.env.PAYPAL_API_BASE;
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

if (!base || !clientId || !clientSecret) {
  throw new Error("PAYPAL_API_BASE, PAYPAL_CLIENT_ID, and PAYPAL_CLIENT_SECRET are required.");
}
if (!['https://api-m.paypal.com', 'https://api-m.sandbox.paypal.com'].includes(base)) throw new Error('Invalid PayPal API URL.');

async function accessToken() {
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error(`PayPal authentication failed (${response.status}).`);
  return (await response.json()).access_token;
}

async function paypal(token, path, body, requestId) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": requestId,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify({ status: response.status, name: data.name, message: data.message, details: data.details }));
  return data;
}

async function main() {
  const token = await accessToken();
  const productId = "dreamayla-membership";
  try {
    await paypal(token, "/v1/catalogs/products", {
      id: productId,
      name: "DreamAyla Membership",
      description: "Private dream interpretation and personal insight membership",
      type: "SERVICE",
      category: "SOFTWARE",
    }, "dreamayla-product-v1");
  } catch (error) {
    if (!String(error.message).includes("RESOURCE_ALREADY_EXISTS") && !String(error.message).includes("DUPLICATE_RESOURCE_IDENTIFIER") && !String(error.message).toLowerCase().includes("already exists")) throw error;
  }

  const createPlan = (name, description, amount, requestId) => paypal(token, "/v1/billing/plans", {
    product_id: productId,
    name,
    description,
    status: "ACTIVE",
    billing_cycles: [{
      frequency: { interval_unit: "MONTH", interval_count: 1 },
      tenure_type: "REGULAR",
      sequence: 1,
      total_cycles: 0,
      pricing_scheme: { fixed_price: { value: amount, currency_code: "USD" } },
    }],
    payment_preferences: { auto_bill_outstanding: true, setup_fee_failure_action: "CANCEL", payment_failure_threshold: 3 },
  }, requestId);

  const journal = await createPlan("Dream Journal", "Thirty personal dream interpretations and a private dream journal each month.", "8.90", crypto.randomUUID());
  const plus = await createPlan("Dreamayla Premium", "Unlimited dream interpretations, Dream DNA, and priority personal insight each month.", "12.90", crypto.randomUUID());
  console.log(JSON.stringify({ PAYPAL_JOURNAL_PLAN_ID: journal.id, PAYPAL_PLUS_PLAN_ID: plus.id }));
}

main().catch((error) => { console.error(error.message); process.exit(1); });
