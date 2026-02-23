import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// Payment success page - no auth required (Stripe redirects here)
router.get("/success", PaymentController.paymentSuccess);

// Payment cancel page - no auth required (Stripe redirects here)
router.get("/cancel", PaymentController.paymentCancel);

export const PaymentRoutes = router;
