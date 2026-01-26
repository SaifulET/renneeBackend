import express from "express";
import { ServiceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/createService",
  auth(USER_ROLE.admin),
  ServiceController.createService
);

router.get(
  "/getallservices",
  ServiceController.getAllServices
);

router.get(
  "/getservicebyid/:id",
  ServiceController.getServiceById
);

router.patch(
  "/updateservice/:id",
  auth(USER_ROLE.admin),
  ServiceController.updateService
);

router.delete(
  "/deleteservice/:id",
  auth(USER_ROLE.admin),
  ServiceController.deleteService
);

export const ServiceRoutes = router;
