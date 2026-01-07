import express, { NextFunction, Request, Response } from "express";
import CollectionControllers from "./collection.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";
import AppError from "../../errors/AppError";
import status from "http-status";

const router = express.Router();

// Admin only routes - Create, Update, Delete collections
router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      next(new AppError(status.BAD_REQUEST, "Invalid JSON data", ""));
    }
  },
  CollectionControllers.createCollection
);
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      next(new AppError(status.BAD_REQUEST, "Invalid JSON data", ""));
    }
  },
  CollectionControllers.updateCollection
);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.deleteCollection);
router.post("/:collectionId/products", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.addProductsToCollection);
router.delete("/:collectionId/products", auth(USER_ROLE.admin, USER_ROLE.superAdmin), CollectionControllers.removeProductsFromCollection);

// Public routes - Get collections
router.get("/", CollectionControllers.getAllCollections);
router.get("/:id", CollectionControllers.getSingleCollection);

export default router;