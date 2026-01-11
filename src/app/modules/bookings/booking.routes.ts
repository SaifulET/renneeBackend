import express from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
  "/availability",
  // auth(USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin), // Public or Protected? User needs to see availability
  BookingController.checkAvailability
);

router.post(
  "/initiate",
  auth(USER_ROLE.buyer, USER_ROLE.admin),
  BookingController.initiateBooking
);

router.post(
  "/confirm",
  auth(USER_ROLE.buyer, USER_ROLE.admin),
  BookingController.confirmBooking
);

export const BookingRoutes = router;
