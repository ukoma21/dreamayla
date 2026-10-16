import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../lib/paypal-validation.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { matchesMonthlyPrice, webhookSubscriptionId } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const plan = {
  status: 'ACTIVE',
  billing_cycles: [{ tenure_type: 'REGULAR', total_cycles: 0, frequency: { interval_unit: 'MONTH', interval_count: 1 }, pricing_scheme: { fixed_price: { value: '8.90', currency_code: 'USD' } } }],
};
assert.equal(matchesMonthlyPrice(plan, '$8.90'), true);
assert.equal(matchesMonthlyPrice(plan, '$12.90'), false, 'Reject a checkout price different from the displayed price');
assert.equal(matchesMonthlyPrice({ ...plan, status: 'INACTIVE' }, '$8.90'), false);
assert.equal(matchesMonthlyPrice({ ...plan, payment_preferences: { setup_fee: { value: '1.00' } } }, '$8.90'), false, 'Reject additional setup fees');
assert.equal(matchesMonthlyPrice({ ...plan, taxes: { percentage: '10' } }, '$8.90'), false, 'Reject unexpected extra charges');
assert.equal(matchesMonthlyPrice({ ...plan, billing_cycles: [...plan.billing_cycles, ...plan.billing_cycles] }, '$8.90'), false);
assert.equal(webhookSubscriptionId({ event_type: 'PAYMENT.SALE.COMPLETED', resource: { id: 'SALE-1', billing_agreement_id: 'I-SUB-1' } }), 'I-SUB-1', 'Use the subscription ID rather than the receipt ID');
assert.equal(webhookSubscriptionId({ event_type: 'PAYMENT.SALE.COMPLETED', resource: { id: 'SALE-1' } }), undefined);
assert.equal(webhookSubscriptionId({ event_type: 'BILLING.SUBSCRIPTION.ACTIVATED', resource: { id: 'I-SUB-1' } }), 'I-SUB-1');
console.log('PayPal price and transaction-to-subscription regression checks passed.');
