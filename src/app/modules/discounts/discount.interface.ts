import { Model } from 'mongoose';

export interface TDiscount {
    title: string;
    description: string;
    percentage: number;
    isActive: boolean;
    isDelete: boolean;
}

export interface DiscountModel extends Model<TDiscount> {
    // eslint-disable-next-line no-unused-vars
    isDiscountExists(id: string): Promise<TDiscount | null>;
}


// {
//     "title": "",
//     "description": "",
//     "percentage": 0,

// }