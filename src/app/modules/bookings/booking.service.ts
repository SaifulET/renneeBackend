import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Booking } from "./booking.model";
import { startOfDay, endOfDay, format } from "date-fns";
import { Service } from "../services/service.model";
import { PaymentHelper } from "../../utils/payment.helper";
import { sendPushNotification } from "../../utils/notification.helper";
import users from "../user/user.model";

const checkAvailability = async (serviceId: string, date: string, consultantId: string) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found", "");
  }

  // Parse date
  const queryDate = new Date(date);
  const start = startOfDay(queryDate);
  const end = endOfDay(queryDate);

  // Get existing bookings for this service + consultant + date
  const existingBookings = await Booking.find({
    service: serviceId,
    consultant: consultantId,
    date: {
      $gte: start,
      $lte: end,
    },
    payment_status: { $ne: "Failed" }, // Exclude failed? Or only Paid/Pending
  }).select("slot_time");

  const bookedTimes = existingBookings.map((b) => b.slot_time);

  // Filter custom_slots
  const availableSlots = service.custom_slots.filter((slot: any) => {
    // slot is { start_time: "HH:mm", end_time: "HH:mm" }
    // Assuming slot_time in booking matches start_time? 
    // The user said "booked_slots: Array of objects ... { slot_time }"
    // I will assume slot_time is the unique identifier (start time).
    return !bookedTimes.includes(slot.start_time);
  });

  return availableSlots;
};



const initiateBooking = async (serviceId: string) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found", "");
  }
  const paymentIntent = await PaymentHelper.createPaymentIntent(service.price);
  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

const confirmBooking = async (payload: any) => {
  const { transaction_id, service: serviceId, user: userId, consultant: consultantId } = payload;

  // Verify Payment
  if (transaction_id) {
    const paymentIntent = await PaymentHelper.retrievePaymentIntent(transaction_id);
    if (paymentIntent.status !== "succeeded") {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment not succeeded", "");
    }
  }

  // Double check availability (race condition prevention)
  const availableSlots = await checkAvailability(serviceId, payload.date, consultantId);
  const isAvailable = availableSlots.some((slot: any) => slot.start_time === payload.slot_time);

  if (!isAvailable) {
     throw new AppError(httpStatus.CONFLICT, "Slot already booked", "");
  }

  payload.payment_status = "Paid";
  const booking = await Booking.create(payload);

  // Send Notification
  const consultant = await users.findById(consultantId);
  const user = await users.findById(userId);

  if (consultant?.fcm) {
    await sendPushNotification(
      consultant.fcm,
      "New Booking Confirmed",
      `You have a new booking with ${user?.fullname || "a client"} at ${payload.slot_time}`
    );
  }
  
    if (user?.fcm) {
    await sendPushNotification(
      user.fcm,
      "Booking Confirmed",
      `Your booking for ${payload.slot_time} is confirmed.`
    );
  }

  return booking;
};

export const BookingService = {
  checkAvailability,
  initiateBooking,
  confirmBooking
};
