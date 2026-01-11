import express from "express";
import { ServiceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  ServiceController.createService
);

router.get(
  "/",
  ServiceController.getAllServices
);

router.get(
  "/:id",
  ServiceController.getServiceById
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  ServiceController.updateService
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin),
  ServiceController.deleteService
);

export const ServiceRoutes = router;
