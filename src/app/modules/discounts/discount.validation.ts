import { z } from 'zod';

const createDiscountValidationSchema = z.object({
    body: z.object({
        title: z.string({
            message: 'Title is required',
        }),
        description: z.string({
            message: 'Description is required',
        }),
        useablecode: z.string({
            message: 'Code is required',
        }),
        maxusetimes: z.number({
            message: 'Max use times is required',
        }),
        limitPerUser: z.number({
            message: 'Limit per user is required',
        }),
        percentage: z.number({
            message: 'Percentage is required',
        }),
        isActive: z.boolean().optional(),
    }),
});

const updateDiscountValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        useablecode: z.string().optional(),
        maxusetimes: z.number().optional(),
        limitPerUser: z.number().optional(),
        percentage: z.number().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const DiscountValidation = {
    createDiscountValidationSchema,
    updateDiscountValidationSchema,
};
