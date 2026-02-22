import express from "express";
import UserValidationSchema from "./user.validation";
import UserController from "./user.controller";

import { USER_ROLE } from "./user.constant";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create user (Admin creation) - Restricted to Super Admin
router.post(
  "/create_user",
  validationRequest(UserValidationSchema.createUserZodSchema),
  UserController.createUser
);

// /api/v1/user/getallconsult
router.get(
  "/getallconsult",
  UserController.getAllConsult
);

router.patch(
  "/user_verification",
  validationRequest(UserValidationSchema.UserVerification),
  UserController.userVarification
);

// {{localUrl}}/api/v1/user/get_single_user/:id
router.get(
  "/get_single_user/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.consultant, USER_ROLE.buyer),
  UserController.getSingleUser
);

router.patch(
  "/change_password",
  auth(USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(UserValidationSchema.ChnagePasswordSchema),
  UserController.chnagePassword
);

router.post(
  "/forgot_password",
  validationRequest(UserValidationSchema.ForgotPasswordSchema),
  UserController.forgotPassword
);

router.post(
  "/verification_forgot_user",
  validationRequest(UserValidationSchema.verificationCodeSchema),
  UserController.verificationForgotUser
);

router.post(
  "/reset_password",
  auth(USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(UserValidationSchema.resetPasswordSchema),
  UserController.resetPassword
);

router.get("/find_by_user_growth", auth(USER_ROLE.admin, USER_ROLE.superAdmin), UserController.getUserGrowth);

router.get("/recently_joined_user", auth(USER_ROLE.admin, USER_ROLE.superAdmin), UserController.recently_joined_user);
router.delete("/delete_user/:id", auth(USER_ROLE.superAdmin), UserController.deleteAllTypesOfUser);

// user Growth
// Recently Joined Users

const UserRouters = router;
export default UserRouters;
