import { z } from "zod";

const createCartCheckoutSessionSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      street: z.string({ message: "Street is required" }),
      city: z.string({ message: "City is required" }),
      state: z.string({ message: "State is required" }),
      postalCode: z.string({ message: "Postal code is required" }),
      country: z.string({ message: "Country is required" }),
    }),
    billingAddress: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      })
      .optional(),
    currency: z.string().default("usd"),
    notes: z.string().optional(),
  }),
});

const createDirectPaymentSchema = z.object({
  body: z.object({
    currency: z.string().default("usd"),
    paymentMethodId: z.string({ message: "Payment method ID is required" }),
    shippingAddress: z.object({
      street: z.string({ message: "Street is required" }),
      city: z.string({ message: "City is required" }),
      state: z.string({ message: "State is required" }),
      postalCode: z.string({ message: "Postal code is required" }),
      country: z.string({ message: "Country is required" }),
    }),
    billingAddress: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      })
      .optional(),
    notes: z.string().optional(),
  }),
});

const CartPaymentValidationSchemas = {
  createCartCheckoutSessionSchema,
  createDirectPaymentSchema,
};

export default CartPaymentValidationSchemas;
