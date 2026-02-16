import express from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// /api/v1/bookings/availability
router.get(
  "/availability",
  // auth(USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin), // Public or Protected? User needs to see availability
  BookingController.checkAvailability
);

// /api/v1/bookings/initiate

// body 
// {
//   "serviceId": "693354569657948948948948",
//   "slot_time": "10:00",
//   "date": "2022-01-01",
//   "discountCode": "DISCOUNT10", 
//   "user_details": {
//     "name": "John Doe",
//     "email": "[EMAIL_ADDRESS]",
//     "phone": "1234567890"
//   },
//   "meeting_type": "video",
//   "consultant": "69827149c64b011d4f5d17ef"
// }

router.post(
  "/initiate",
  auth(USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.consultant, USER_ROLE.superAdmin),
  BookingController.initiateBooking
);

router.get(
  "/get_all_booked_data_for_admin",
  auth( USER_ROLE.admin, USER_ROLE.superAdmin),
  BookingController.getAllBookedDataForAdmin
);

router.get(
  "/get_all_booked_data_for_consultant",
  auth( USER_ROLE.admin, USER_ROLE.consultant, USER_ROLE.superAdmin),
  BookingController.getAllBookedDataForConsultant
);



// /api/v1/bookings/confirm
router.post(
  "/confirm",
  auth(USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.consultant, USER_ROLE.superAdmin),
  BookingController.confirmBooking
);

// /api/v1/bookings/webhookverify
router.post(
  "/webhookverify",
  BookingController.webhookVerify
);

// /api/v1/bookings/my-bookings?status=completed or ongoing or cancled
router.get(
  "/my-bookings",
  auth(USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin, USER_ROLE.superAdmin),
  BookingController.getMyPaidBookings
);

// /api/v1/bookings/my-bookings/:id
router.get(
  "/my-bookings/:id",
  auth(USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin, USER_ROLE.superAdmin),
  BookingController.getSingleBooking
);

// /api/v1/bookings/cancel/:id
router.patch(
  "/cancel/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  BookingController.cancelBooking
);

export const BookingRoutes = router;
