import express, { NextFunction, Request, Response } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const router = express.Router();

router.post(
  "/createcategory",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      next(new AppError(httpStatus.BAD_REQUEST, "Invalid JSON data", ""));
    }
  },
  CategoryController.createCategory
);

router.get(
  "/getallcategories",
  CategoryController.getAllCategories
);

router.get(
  "/getcategorybyid/:id",
  CategoryController.getCategoryById
);

router.patch(
  "/updatecategory/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      next(new AppError(httpStatus.BAD_REQUEST, "Invalid JSON data", ""));
    }
  },
  CategoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
