import express from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  CategoryController.createCategory
);

router.get(
  "/",
  CategoryController.getAllCategories
);

router.get(
  "/:id",
  CategoryController.getCategoryById
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
