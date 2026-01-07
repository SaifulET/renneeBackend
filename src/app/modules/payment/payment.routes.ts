import { Router } from "express";
import PaymentController from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// Cart payment routes (require authentication - user ID from JWT)
router.post(
  "/cart/create-checkout-session",
  auth(
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createCartCheckoutSession
);

// Direct payment route (require authentication - for Stripe.js frontend integration)
router.post(
  "/direct-payment",
  auth(
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createDirectPayment
);

// Protected routes (require authentication)
router.post(
  "/confirm-payment",
  auth(
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.confirmPayment
);
router.post(
  "/refund",
  auth(
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.refundPayment
);

// Webhook endpoint (no auth middleware for Stripe webhooks)
router.post("/webhook", PaymentController.webhookHandler);

export default router;
