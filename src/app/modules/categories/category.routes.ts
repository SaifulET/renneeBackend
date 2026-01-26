import express from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/createcategory",
  auth(USER_ROLE.admin),
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
  auth(USER_ROLE.admin),
  CategoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  auth(USER_ROLE.admin),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
