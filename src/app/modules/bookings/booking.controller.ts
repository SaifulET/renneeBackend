import { Request, Response } from "express";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BookingService } from "./booking.service";

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
  const result = await BookingService.initiateBooking(req.body.serviceId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Intent created successfully",
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

export const BookingController = {
  checkAvailability,
  initiateBooking,
  confirmBooking
};
