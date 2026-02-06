import { Model, Types } from "mongoose";

export interface TBookingUserDetails {
    name?: string;
    email?: string;
    phone?: string;
}

export interface TBooking {
    user: Types.ObjectId;
    service: Types.ObjectId;
    consultant: Types.ObjectId;
    discount?: Types.ObjectId;
    user_details?: TBookingUserDetails;
    date: Date;
    slot_time: string;
    meeting_type: "Online" | "Offline" | "Both";
    payment_status: "Pending" | "Paid" | "Failed" | "Cancelled";
    transaction_id?: string;
    conversation?: Types.ObjectId;
}

export interface BookingModel extends Model<TBooking> { }
