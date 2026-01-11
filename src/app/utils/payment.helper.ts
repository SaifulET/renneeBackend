import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(config.stripe_payment_gateway.stripe_secret_key as string, {
  // apiVersion: '2025-01-27.acacia',
});

const createPaymentIntent = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: "usd",
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });
  return paymentIntent;
};

const retrievePaymentIntent = async (id: string) => {
    return await stripe.paymentIntents.retrieve(id);
}

export const PaymentHelper = {
  createPaymentIntent,
  retrievePaymentIntent
};
