import express from "express";
import CartControllers from "./cart.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Authenticated user routes - Add, Update, Remove, Clear cart items
router.post("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.addToCart);
router.get("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.getMyCart);
router.get("/check/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.checkIfProductInCart);
router.delete("/clear", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.clearMyCart);
router.delete("/product/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.removeFromCart);
router.put("/product/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.updateCartItemQuantity);
router.delete("/:id", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), CartControllers.deleteCartItem);

export default router;