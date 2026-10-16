export type PayPalPlan = {
  status?: string;
  billing_cycles?: Array<{ tenure_type?: string; total_cycles?: number; frequency?: { interval_unit?: string; interval_count?: number }; pricing_scheme?: { fixed_price?: { value?: string; currency_code?: string } } }>;
  payment_preferences?: { setup_fee?: { value?: string; currency_code?: string }; auto_bill_outstanding?: boolean };
  taxes?: { percentage?: string };
};

// Reject an outdated PayPal plan before redirecting a member to approval.
export function matchesMonthlyPrice(plan: PayPalPlan, expected: string) {
  const cycles = plan.billing_cycles;
  if (plan.status !== 'ACTIVE' || cycles?.length !== 1) return false;
  const cycle = cycles[0], price = cycle.pricing_scheme?.fixed_price;
  return cycle.tenure_type === 'REGULAR' && cycle.total_cycles === 0
    && cycle.frequency?.interval_unit === 'MONTH' && cycle.frequency.interval_count === 1
    && price?.currency_code === 'USD' && Number(price.value) === Number(expected.replace('$', ''))
    && Number(plan.payment_preferences?.setup_fee?.value || 0) === 0
    && Number(plan.taxes?.percentage || 0) === 0;
}

export function webhookSubscriptionId(event: { event_type?: string; resource?: { id?: string; billing_agreement_id?: string } }) {
  return event.event_type?.startsWith('PAYMENT.SALE.') ? event.resource?.billing_agreement_id : event.resource?.id;
}
