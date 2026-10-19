import Stripe from "stripe";
import config from "../config";

let stripeClient: Stripe | null = null;

const getStripe = () => {
  if (stripeClient) return stripeClient;
  const key = config.stripe_payment_gateway.stripe_secret_key;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  stripeClient = new Stripe(key);
  return stripeClient;
};

const createPaymentIntent = async (amount: number) => {
  const paymentIntent = await getStripe().paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: "usd",
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });
  return paymentIntent;
};

const retrievePaymentIntent = async (id: string) => {
  return await getStripe().paymentIntents.retrieve(id);
}

const createCheckoutSession = async (payload: {
  productName: string;
  description: string;
  amount: number;
  metadata: Record<string, string>;
  customerEmail?: string;
}) => {
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: payload.productName,
            description: payload.description,
          },
          unit_amount: Math.round(payload.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: config.stripe_payment_gateway.checkout_success_url,
    cancel_url: config.stripe_payment_gateway.checkout_cancel_url,
    metadata: payload.metadata,
    customer_email: payload.customerEmail,
  });
  return session;
};

const verifyWebhookEvent = (body: string | Buffer, signature: string) => {
  return getStripe().webhooks.constructEvent(
    body,
    signature,
    config.stripe_payment_gateway.stripe_webhook_secret as string
  );
};

export const PaymentHelper = {
  createPaymentIntent,
  retrievePaymentIntent,
  createCheckoutSession,
  verifyWebhookEvent
};
