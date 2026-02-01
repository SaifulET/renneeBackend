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

  // Update Service Unavailability
  const service = await Service.findById(serviceId);
  if (service) {
    const bookingDate = new Date(payload.date);

    // Find if date exists in unavailable_slots_of_date
    let slotEntry = service.unavailable_slots_of_date.find(
      (entry) => new Date(entry.date).toDateString() === bookingDate.toDateString()
    );

    if (slotEntry) {
      if (!slotEntry.slots.includes(payload.slot_time)) {
        slotEntry.slots.push(payload.slot_time);
      }
    } else {
      service.unavailable_slots_of_date.push({
        date: bookingDate,
        slots: [payload.slot_time]
      });
      // refetch reference potentially needed if push doesn't return the object in a way TS likes, 
      // but typically simple push works.
      // We need to re-find it to check length below, or just look at last element.
      slotEntry = service.unavailable_slots_of_date[service.unavailable_slots_of_date.length - 1];
    }

    // Check if full
    const totalSlots = service.custom_slots.length;

    if (slotEntry && slotEntry.slots.length >= totalSlots) {
      const isDateUnavailable = service.unavailable_dates.some(
        (d) => new Date(d).toDateString() === bookingDate.toDateString()
      );
      if (!isDateUnavailable) {
        service.unavailable_dates.push(bookingDate);
      }
    }

    await service.save();
  }

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
