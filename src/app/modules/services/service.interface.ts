import { Model, Types } from "mongoose";

export interface TUnavailableSlot {
    date: Date;
    slots: string[];
}

export interface TService {
    title: string;
    description: string;
    category_id: Types.ObjectId;
    price: number;
    duration: number; // in minutes
    imgs: string[];
    availability_type: "Online" | "Offline" | "Both";
    weekends: string[];
    unavailable_dates: Date[];
    unavailable_slots_of_date: TUnavailableSlot[];
    custom_slots: { start_time: string }[];
    consultant_ids: Types.ObjectId[];
    isFeatured: boolean;
}

export interface ServiceModel extends Model<TService> { }
