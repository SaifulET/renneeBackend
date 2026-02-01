import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TDiscount } from './discount.interface';
import { Discount } from './discount.model';

const createDiscountIntoDb = async (payload: TDiscount) => {
    const result = await Discount.create(payload);
    return result;
};

const getAllDiscountsFromDb = async () => {
    const result = await Discount.find();
    return result;
}

const getDiscountByIdFromDb = async (id: string) => {
    const result = await Discount.findById(id);
    return result;
}

const updateDiscountIntoDb = async (id: string, payload: Partial<TDiscount>) => {
    const isDiscountExists = await Discount.isDiscountExists(id);
    if (!isDiscountExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
    }
    const result = await Discount.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
}

const deleteDiscountFromDb = async (id: string) => {
    const isDiscountExists = await Discount.isDiscountExists(id);
    if (!isDiscountExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
    }
    const result = await Discount.findByIdAndUpdate(id, { isDelete: true }, {
        new: true,
    });
    return result;
}


export const DiscountServices = {
    createDiscountIntoDb,
    getAllDiscountsFromDb,
    getDiscountByIdFromDb,
    updateDiscountIntoDb,
    deleteDiscountFromDb
};
