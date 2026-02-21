/**
 * Stripe - Paiements (mock si pas de clé)
 */
const stripeSecret = process.env.STRIPE_SECRET_KEY;

export async function createPaymentIntent(amount: number, currency = 'eur', metadata?: Record<string, string>) {
  if (!stripeSecret || stripeSecret.startsWith('sk_test')) {
    return { clientSecret: 'pi_mock_' + Date.now(), id: 'pi_mock_' + Date.now() };
  }
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeSecret);
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

export async function createSubscription(customerId: string, priceId: string) {
  if (!stripeSecret) {
    return { id: 'sub_mock_' + Date.now(), clientSecret: null };
  }
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeSecret);
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
}
