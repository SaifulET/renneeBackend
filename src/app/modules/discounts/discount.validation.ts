import { z } from 'zod';

const createDiscountValidationSchema = z.object({
    body: z.object({
        title: z.string({
            message: 'Title is required',
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
        percentage: z.number().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const DiscountValidation = {
    createDiscountValidationSchema,
    updateDiscountValidationSchema,
};
