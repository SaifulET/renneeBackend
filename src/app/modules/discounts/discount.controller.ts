import httpStatus from 'http-status';
import catchAsync from '../../utils/asyncCatch';
import sendResponse from '../../utils/sendResponse';
import { DiscountServices } from './discount.service';

const createDiscount = catchAsync(async (req, res) => {
    const result = await DiscountServices.createDiscountIntoDb(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discount created successfully',
        data: result,
    });
});

const getAllDiscounts = catchAsync(async (req, res) => {
    const result = await DiscountServices.getAllDiscountsFromDb();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discounts retrieved successfully',
        data: result,
    });
});

const getDiscountById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DiscountServices.getDiscountByIdFromDb(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discount retrieved successfully',
        data: result,
    });
});

const updateDiscount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DiscountServices.updateDiscountIntoDb(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discount updated successfully',
        data: result,
    });
});

const deleteDiscount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DiscountServices.deleteDiscountFromDb(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discount deleted successfully',
        data: result,
    });
});

export const DiscountController = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
};
