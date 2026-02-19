import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Booking } from "./booking.model";
import { startOfDay, endOfDay, format } from "date-fns";
import { Service } from "../services/service.model";
import { PaymentHelper } from "../../utils/payment.helper";
import { sendPushNotification } from "../../utils/notification.helper";
import users from "../user/user.model";
import { Discount } from "../discounts/discount.model";
import { Conversation } from "../message/message.model";
import { USER_ROLE } from "../user/user.constant";

const getSingleBooking = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate("service")
    .populate("consultant")
    .populate("user")
    .populate("discount");

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found", "");
  }

  // Check for conversation
  const conversation = await Conversation.findOne({
    participants: { $all: [booking.user._id, booking.consultant._id] },
  });

  return {
    ...booking.toObject(),
    conversationId: conversation?._id || null,
  };
};

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
    payment_status: "Paid",
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



const initiateBooking = async (payload: {
  serviceId: string;
  slot_time: string;
  date: string;
  user: string; // User ID
  discountCode?: string;
  user_details?: {
    name: string;
    email: string;
    phone: string;
  };
  meeting_type: string;
  consultant: string;
}) => {
  const { serviceId, slot_time, date, user, discountCode, user_details, meeting_type, consultant } = payload;

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found", "");
  }

  // Check if slot exists in service
  const isValidSlot = service.custom_slots.some((slot: any) => slot.start_time === slot_time);
  if (!isValidSlot) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot is not available or missing", "");
  }

  // Check availability
  const availableSlots = await checkAvailability(serviceId, date, consultant);
  const isAvailable = availableSlots.some((slot: any) => slot.start_time === slot_time);

  if (!isAvailable) {
    throw new AppError(httpStatus.CONFLICT, "Slot already booked", "");
  }

  let finalPrice = service.price;
  let discountId = null;

  if (discountCode) {
    const discount = await Discount.findOne({ useablecode: discountCode, isActive: true, isDelete: false });
    if (!discount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired discount code", "");
    }
    // Calculate discount
    const discountAmount = (service.price * discount.percentage) / 100;
    finalPrice = service.price - discountAmount;
    discountId = discount._id;
  }

  // Find or Create Conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [user, consultant] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [user, consultant],
    });
  }

  // Create Pending Booking
  const booking = await Booking.create({
    user,
    service: serviceId,
    consultant,
    discount: discountId, // Optional
    user_details,
    date,
    slot_time,
    meeting_type,
    payment_status: "Pending",
    conversation: conversation._id,
  });

  // Create Stripe Checkout Session
  const session = await PaymentHelper.createCheckoutSession({
    productName: service.title,
    description: `Booking for ${service.title} at ${slot_time} on ${date}`,
    amount: finalPrice,
    metadata: {
      bookingId: booking._id.toString(),
      userId: user,
      serviceId: serviceId,
      consultantId: consultant,
      slot_time: slot_time,
      date: date
    }, // Add necessary metadata
    customerEmail: user_details?.email // Optional
  });

  // Save session ID as transaction_id (optional, useful for tracking)
  booking.transaction_id = session.id;
  await booking.save();

  return {
    paymentUrl: session.url,
    bookingId: booking._id
  };
};

const webhookVerify = async (event: any) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error("No bookingId in session metadata");
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error("Booking not found");
      return;
    }

    if (booking.payment_status === 'Paid') {
      return; // Already processed
    }

    booking.payment_status = 'Paid';
    booking.transaction_id = session.id;
    await booking.save();

    // --- logic from confirmBooking start ---
    const serviceId = booking.service.toString();
    const service = await Service.findById(serviceId);
    if (service) {
      const bookingDate = new Date(booking.date);

      let slotEntry = service.unavailable_slots_of_date.find(
        (entry) => new Date(entry.date).toDateString() === bookingDate.toDateString()
      );

      if (slotEntry) {
        if (!slotEntry.slots.includes(booking.slot_time)) {
          slotEntry.slots.push(booking.slot_time);
        }
      } else {
        service.unavailable_slots_of_date.push({
          date: bookingDate,
          slots: [booking.slot_time]
        });
        slotEntry = service.unavailable_slots_of_date[service.unavailable_slots_of_date.length - 1];
      }

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

    // Send Notifications
    const consultantId = booking.consultant.toString();
    const userId = booking.user.toString();

    const consultant = await users.findById(consultantId);
    const user = await users.findById(userId);

    // Send notification to consultant
    if (consultant?.fcm) {
      await sendPushNotification(
        consultant.fcm,
        "New Booking Confirmed",
        `You have a new booking with ${user?.fullname || "a client"} at ${booking.slot_time}`
      );
    }

    // Send notification to user
    if (user?.fcm) {
      await sendPushNotification(
        user.fcm,
        "Booking Confirmed",
        `Your booking for ${booking.slot_time} is confirmed.`
      );
    }

    // Send notifications to all admins and super admins
    const admins = await users.find({
      role: { $in: [USER_ROLE.admin, USER_ROLE.superAdmin] }
    });

    for (const admin of admins) {
      // Always create database notification
      const { NotificationService } = await import("../notifications/notification.service");
      await NotificationService.createNotification(
        admin._id.toString(),
        "New Booking Paid",
        `A new booking has been paid by ${user?.fullname || "a client"} with ${consultant?.fullname || "a consultant"} for ${booking.slot_time}`,
        "booking",
        {
          senderId: userId,
          relatedId: booking._id.toString(),
          priority: "medium",
          metadata: {
            bookingId: booking._id.toString(),
            userName: user?.fullname,
            consultantName: consultant?.fullname,
            slotTime: booking.slot_time
          }
        }
      );

      // Send push notification only if FCM token exists
      if (admin.fcm) {
        await sendPushNotification(
          admin.fcm,
          "New Booking Paid",
          `A new booking has been paid by ${user?.fullname || "a client"} with ${consultant?.fullname || "a consultant"} for ${booking.slot_time}`
        );
      }
    }
    // --- logic from confirmBooking end ---
  }
};

const getMyPaidBookings = async (userId: string, query: Record<string, unknown>) => {
  const { filter, page = 1, limit = 10 } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const matchQuery: any = { user: userId };

  // Use start of today to ensure "ongoing" includes bookings later today
  // and "completed" includes strictly past days.
  const currentDate = startOfDay(new Date());

  if (filter === 'completed') {
    matchQuery.payment_status = "Paid";
    matchQuery.date = { $lt: currentDate };
  } else if (filter === 'ongoing') {
    matchQuery.payment_status = "Paid";
    matchQuery.date = { $gte: currentDate };
  } else {
    // Default behavior if no filter is provided: Return all Paid bookings
    matchQuery.payment_status = "Paid";
  }

  const total = await Booking.countDocuments(matchQuery);
  const totalPage = Math.ceil(total / limitNumber);

  const result = await Booking.find(matchQuery)
    .populate({
      path: 'service',
      select: 'title description price imgs availability_type duration'
    })
    .populate({
      path: 'consultant',
      select: 'name email phone images'
    })
    .sort({ date: 1, slot_time: 1 }) // Sort by date ascending
    .skip(skip)
    .limit(limitNumber);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage
    },
    data: result
  };
}

const cancelBooking = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found", "");
  }

  booking.payment_status = "Cancelled";
  await booking.save();

  // Optional: Free up the slot?
  // If it was Paid, the slot was blocked in Service.
  // We should probably remove it from Service.unavailable_slots_of_date
  // Implementation for unblocking slot:
  const serviceId = booking.service.toString();
  const service = await Service.findById(serviceId);
  if (service) {
    const bookingDate = new Date(booking.date);
    const slotEntry = service.unavailable_slots_of_date.find(
      (entry) => new Date(entry.date).toDateString() === bookingDate.toDateString()
    );
    if (slotEntry) {
      slotEntry.slots = slotEntry.slots.filter(s => s !== booking.slot_time);
      // If slots empty, remove the entry? check logic
      // also check unavailable_dates
      if (slotEntry.slots.length === 0) {
        service.unavailable_slots_of_date = service.unavailable_slots_of_date.filter(
          (entry) => new Date(entry.date).toDateString() !== bookingDate.toDateString()
        );
        // remove from unavailable_dates
        service.unavailable_dates = service.unavailable_dates.filter(
          d => new Date(d).toDateString() !== bookingDate.toDateString()
        );
      } else {
        // Check if it was full and now isn't
        // Simply re-evaluating fullness might be complex, 
        // but removing from unavailable_dates is safe if we know it's not full anymore.
        // If we perform exact check:
        const totalSlots = service.custom_slots.length;
        if (slotEntry.slots.length < totalSlots) {
          service.unavailable_dates = service.unavailable_dates.filter(
            d => new Date(d).toDateString() !== bookingDate.toDateString()
          );
        }
      }
    }
    await service.save();
  }

  return booking;
}

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

  // Send notification to consultant
  if (consultant?.fcm) {
    await sendPushNotification(
      consultant.fcm,
      "New Booking Confirmed",
      `You have a new booking with ${user?.fullname || "a client"} at ${payload.slot_time}`
    );
  }

  // Send notification to user
  if (user?.fcm) {
    await sendPushNotification(
      user.fcm,
      "Booking Confirmed",
      `Your booking for ${payload.slot_time} is confirmed.`
    );
  }

  // Send notifications to all admins and super admins
  const admins = await users.find({
    role: { $in: [USER_ROLE.admin, USER_ROLE.superAdmin] }
  });

  for (const admin of admins) {
    // Always create database notification
    const { NotificationService } = await import("../notifications/notification.service");
    await NotificationService.createNotification(
      admin._id.toString(),
      "New Booking Paid",
      `A new booking has been paid by ${user?.fullname || "a client"} with ${consultant?.fullname || "a consultant"} for ${payload.slot_time}`,
      "booking",
      {
        senderId: userId,
        relatedId: booking._id.toString(),
        priority: "medium",
        metadata: {
          bookingId: booking._id.toString(),
          userName: user?.fullname,
          consultantName: consultant?.fullname,
          slotTime: payload.slot_time
        }
      }
    );

    // Send push notification only if FCM token exists
    if (admin.fcm) {
      await sendPushNotification(
        admin.fcm,
        "New Booking Paid",
        `A new booking has been paid by ${user?.fullname || "a client"} with ${consultant?.fullname || "a consultant"} for ${payload.slot_time}`
      );
    }
  }

  return booking;
};

const getAllBookedDataForAdmin = async (query: Record<string, unknown>) => {
  const { filter, page = 1, limit = 10, status, date, consultant, consultantid } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const matchQuery: any = {};

  // Filter by payment status
  if (status) {
    matchQuery.payment_status = status;
  }

  // Filter by date
  if (date) {
    const queryDate = new Date(date as string);
    const start = startOfDay(queryDate);
    const end = endOfDay(queryDate);
    matchQuery.date = { $gte: start, $lte: end };
  }

  // Filter by consultant (support both 'consultant' and 'consultantid' parameters)
  const consultantId = consultant || consultantid;
  if (consultantId) {
    matchQuery.consultant = consultantId;
  }

  const total = await Booking.countDocuments(matchQuery);
  const totalPage = Math.ceil(total / limitNumber);

  const result = await Booking.find(matchQuery)
    .populate({
      path: 'service',
      select: 'title description price imgs availability_type duration'
    })
    .populate({
      path: 'consultant',
      select: 'name email phone images'
    })
    .populate({
      path: 'user',
      select: 'name email phone images'
    })
    .populate({
      path: 'discount',
      select: 'percentage useablecode'
    })
    .sort({ date: -1, slot_time: -1 }) // Sort by date descending (most recent first)
    .skip(skip)
    .limit(limitNumber);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage
    },
    data: result
  };
};

const getAllBookedDataForConsultant = async (consultantId: string, query: Record<string, unknown>) => {
  const { filter, page = 1, limit = 10, status, date } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const matchQuery: any = { consultant: consultantId };

  // Filter by payment status
  if (status) {
    matchQuery.payment_status = status;
  }

  // Filter by date
  if (date) {
    const queryDate = new Date(date as string);
    const start = startOfDay(queryDate);
    const end = endOfDay(queryDate);
    matchQuery.date = { $gte: start, $lte: end };
  }

  const total = await Booking.countDocuments(matchQuery);
  const totalPage = Math.ceil(total / limitNumber);

  const result = await Booking.find(matchQuery)
    .populate({
      path: 'service',
      select: 'title description price imgs availability_type duration'
    })
    .populate({
      path: 'user',
      select: 'name email phone images'
    })
    .populate({
      path: 'discount',
      select: 'percentage useablecode'
    })
    .sort({ date: -1, slot_time: -1 }) // Sort by date descending (most recent first)
    .skip(skip)
    .limit(limitNumber);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage
    },
    data: result
  };
};

export const BookingService = {
  checkAvailability,
  initiateBooking,
  confirmBooking,
  webhookVerify,
  getMyPaidBookings,
  cancelBooking,
  getSingleBooking,
  getAllBookedDataForAdmin,
  getAllBookedDataForConsultant
};
