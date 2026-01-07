import express from "express";
import ProductControllers from "./products.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";

const router = express.Router();

// Admin only routes - Create, Update, Delete products
router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array("images", 8),
  (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }

      // Parse numeric fields from strings
      if (req.body.price && typeof req.body.price === "string") {
        req.body.price = parseFloat(req.body.price);
      }
      if (
        req.body.stock_quantity &&
        typeof req.body.stock_quantity === "string"
      ) {
        req.body.stock_quantity = parseInt(req.body.stock_quantity);
      }
      if (req.body.isFeatured && typeof req.body.isFeatured === "string") {
        req.body.isFeatured =
          req.body.isFeatured === "true" || req.body.isFeatured === "1";
      }

      // Handle optional array fields from form data
      if (req.body.categories && typeof req.body.categories === "string") {
        req.body.categories = req.body.categories
          .split(",")
          .map((item: string) => item.trim());
      }
      // skintype is now a single value, case-sensitive (exact match required)
      if (req.body.skintype && typeof req.body.skintype === "string") {
        req.body.skintype = req.body.skintype.trim();
      }
      // ingredients is now an array, case-sensitive (exact match required)
      if (req.body.ingredients && typeof req.body.ingredients === "string") {
        req.body.ingredients = req.body.ingredients
          .split(",")
          .map((item: string) => item.trim());
      }
      // collections is now an array, filter out empty strings
      if (req.body.collections && typeof req.body.collections === "string") {
        req.body.collections = req.body.collections
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "");
      } else if (Array.isArray(req.body.collections)) {
        req.body.collections = req.body.collections.filter(
          (item: any) => item !== "" && item !== null && item !== undefined
        );
      }

      // Handle uploaded images - pass file objects to service for Cloudinary upload
      if (req.files && Array.isArray(req.files)) {
        req.body.imageFiles = req.files as Express.Multer.File[];
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  ProductControllers.createProduct
);
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array("images", 8),
  (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }

      // Parse numeric fields from strings
      if (req.body.price && typeof req.body.price === "string") {
        req.body.price = parseFloat(req.body.price);
      }
      if (
        req.body.stock_quantity &&
        typeof req.body.stock_quantity === "string"
      ) {
        req.body.stock_quantity = parseInt(req.body.stock_quantity);
      }
      if (req.body.isFeatured && typeof req.body.isFeatured === "string") {
        req.body.isFeatured =
          req.body.isFeatured === "true" || req.body.isFeatured === "1";
      }

      // Handle optional array fields from form data
      if (req.body.categories && typeof req.body.categories === "string") {
        req.body.categories = req.body.categories
          .split(",")
          .map((item: string) => item.trim());
      }
      // skintype is now a single value, case-sensitive (exact match required)
      if (req.body.skintype && typeof req.body.skintype === "string") {
        req.body.skintype = req.body.skintype.trim();
      }
      // ingredients is now an array, case-sensitive (exact match required)
      if (req.body.ingredients && typeof req.body.ingredients === "string") {
        req.body.ingredients = req.body.ingredients
          .split(",")
          .map((item: string) => item.trim());
      }
      // collections is now an array, filter out empty strings
      if (req.body.collections && typeof req.body.collections === "string") {
        req.body.collections = req.body.collections
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "");
      } else if (Array.isArray(req.body.collections)) {
        req.body.collections = req.body.collections.filter(
          (item: any) => item !== "" && item !== null && item !== undefined
        );
      }

      // Handle uploaded images for update - pass file objects to service for Cloudinary upload
      if (req.files && Array.isArray(req.files)) {
        req.body.imageFiles = req.files as Express.Multer.File[];
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  ProductControllers.updateProduct
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ProductControllers.deleteProduct
);

// Public routes - Get products
router.get("/", ProductControllers.getAllProducts);

// Fast search endpoint - returns only id, name, and first image
router.get("/search", ProductControllers.searchProducts);

router.get("/getrelatedproducts/:id", ProductControllers.getRelatedProducts);

router.get("/getfeaturedproducts", ProductControllers.getFeaturedProducts);

router.get(
  "/collection/:collectionId",
  ProductControllers.getProductsByCollection
);
router.get("/:id", ProductControllers.getSingleProduct);

export default router;
