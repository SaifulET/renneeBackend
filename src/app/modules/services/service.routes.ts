import express, { NextFunction, Request, Response } from "express";
import { ServiceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const router = express.Router();

router.post(
  "/createService",
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
  ServiceController.updateService
);

router.delete(
  "/deleteservice/:id",
  auth(USER_ROLE.admin),
  ServiceController.deleteService
);

export const ServiceRoutes = router;
