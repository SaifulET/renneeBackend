import { Request, Response } from "express";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ServiceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.createService(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getAllServices();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: result,
  });
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getServiceById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service retrieved successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.updateService(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.deleteService(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service deleted successfully",
    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
