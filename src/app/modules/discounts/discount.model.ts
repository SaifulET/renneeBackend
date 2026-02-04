import { Schema, model } from 'mongoose';
import { DiscountModel, TDiscount } from './discount.interface';

const DiscountSchema = new Schema<TDiscount, DiscountModel>(
    {
        title: {
            type: String,
            required: [true, 'Discount title is required'],
        },
        description: {
            type: String,
            required: [true, 'Discount description is required'],
        },
        useablecode: {
            type: String,
            required: [true, 'Discount useablecode is required'],
        },
        percentage: {
            type: Number,
            required: [true, 'Discount percentage is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

DiscountSchema.pre('find', function (next) {
    this.find({ isDelete: { $ne: true } });
    next();
});

DiscountSchema.pre('findOne', function (next) {
    this.findOne({ isDelete: { $ne: true } });
    next();
});

DiscountSchema.statics.isDiscountExists = async function (id: string) {
    return await this.findById(id);
};

export const Discount = model<TDiscount, DiscountModel>(
    'Discount',
    DiscountSchema,
);
