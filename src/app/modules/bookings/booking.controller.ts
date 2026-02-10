import { Request, Response } from "express";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BookingService } from "./booking.service";
import { PaymentHelper } from "../../utils/payment.helper";
import AppError from "../../errors/AppError";

const checkAvailability = catchAsync(async (req: Request, res: Response) => {
  const { serviceId, date, consultantId } = req.query;

  const result = await BookingService.checkAvailability(
    serviceId as string,
    date as string,
    consultantId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Available slots retrieved successfully",
    data: result,
  });
});

const initiateBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user.id;
  const result = await BookingService.initiateBooking({ ...req.body, user });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Link generated successfully",
    data: result,
  });
});

const webhookVerify = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  // We expect raw body here. If express.json() is used globally, we might need a workaround or ensure this route gets raw body.
  // However, if we can't get raw body easily due to global middleware, we might need to rely on the body being parsed if the signature verification isn't strict or if we can get the raw buffer.
  // Standard approach: use a middleware to capture raw body for webhook route.
  // For now, assuming config.stripe_webhook_secret exists and we try to verify.
  // If req.body is already JSON, stripe.webhooks.constructEvent needs string or buffer.

  let event;
  try {
    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      throw new AppError(httpStatus.BAD_REQUEST, "Missing raw body for webhook verification", "");
    }
    event = PaymentHelper.verifyWebhookEvent(rawBody, sig as string);
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`, "");
  }

  await BookingService.webhookVerify(event);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook received",
    data: null
  });
});

const getMyPaidBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user.id;
  const { meta, data } = await BookingService.getMyPaidBookings(user, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Paid bookings retrieved successfully",
    meta,
    data,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingService.cancelBooking(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: result,
  });
});

const confirmBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.confirmBooking(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking confirmed successfully",
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingService.getSingleBooking(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking retrieved successfully",
    data: result,
  });
});

export const BookingController = {
  checkAvailability,
  initiateBooking,
  confirmBooking,
  webhookVerify,
  getMyPaidBookings,
  cancelBooking,
  getSingleBooking
};
